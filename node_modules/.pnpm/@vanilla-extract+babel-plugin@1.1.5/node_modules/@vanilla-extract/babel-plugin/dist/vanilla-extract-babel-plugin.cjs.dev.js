'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var path = require('path');
var core = require('@babel/core');
var template = require('@babel/template');
var integration = require('@vanilla-extract/integration');

function _interopDefault (e) { return e && e.__esModule ? e : { 'default': e }; }

var template__default = /*#__PURE__*/_interopDefault(template);

const packageIdentifiers = new Set(['@vanilla-extract/css', '@vanilla-extract/recipes']);
const filescopePackageIdentifier = '@vanilla-extract/css/fileScope';
const buildSetFileScopeESM = template__default["default"](`
  import * as __vanilla_filescope__ from '${filescopePackageIdentifier}'
  __vanilla_filescope__.setFileScope(%%filePath%%, %%packageName%%)
`);
const buildSetFileScopeCJS = template__default["default"](`
  const __vanilla_filescope__ = require('${filescopePackageIdentifier}');
  __vanilla_filescope__.setFileScope(%%filePath%%, %%packageName%%)
`);
const buildEndFileScope = template__default["default"](`__vanilla_filescope__.endFileScope()`);
const debuggableFunctionConfig = {
  style: {
    maxParams: 2
  },
  createTheme: {
    maxParams: 3
  },
  styleVariants: {
    maxParams: 3
  },
  fontFace: {
    maxParams: 2
  },
  keyframes: {
    maxParams: 2
  },
  createVar: {
    maxParams: 1
  },
  recipe: {
    maxParams: 2
  }
};
const styleFunctions = [...Object.keys(debuggableFunctionConfig), 'globalStyle', 'createGlobalTheme', 'createThemeContract', 'globalFontFace', 'globalKeyframes', 'recipe'];

const extractName = node => {
  if (core.types.isObjectProperty(node) && core.types.isIdentifier(node.key)) {
    return node.key.name;
  } else if ((core.types.isVariableDeclarator(node) || core.types.isFunctionDeclaration(node)) && core.types.isIdentifier(node.id)) {
    return node.id.name;
  } else if (core.types.isExportDefaultDeclaration(node)) {
    return 'default';
  } else if (core.types.isVariableDeclarator(node) && core.types.isArrayPattern(node.id) && core.types.isIdentifier(node.id.elements[0])) {
    return node.id.elements[0].name;
  }
};

const getDebugId = path => {
  const firstRelevantParentPath = path.findParent(({
    node
  }) => !(core.types.isCallExpression(node) || core.types.isSequenceExpression(node)));

  if (!firstRelevantParentPath) {
    return;
  } // Special case: Handle `export const [themeClass, vars] = createTheme({});`
  // when it's already been compiled into this:
  //
  // var _createTheme = createTheme({}),
  //   _createTheme2 = _slicedToArray(_createTheme, 2),
  //   themeClass = _createTheme2[0],
  //   vars = _createTheme2[1];


  if (core.types.isVariableDeclaration(firstRelevantParentPath.parent) && firstRelevantParentPath.parent.declarations.length === 4) {
    const [themeDeclarator,, classNameDeclarator] = firstRelevantParentPath.parent.declarations;

    if (core.types.isCallExpression(themeDeclarator.init) && core.types.isIdentifier(themeDeclarator.init.callee, {
      name: 'createTheme'
    }) && core.types.isVariableDeclarator(classNameDeclarator) && core.types.isIdentifier(classNameDeclarator.id)) {
      return classNameDeclarator.id.name;
    }
  }

  const relevantParent = firstRelevantParentPath.node;

  if (core.types.isObjectProperty(relevantParent) || core.types.isReturnStatement(relevantParent) || core.types.isArrowFunctionExpression(relevantParent) || core.types.isArrayExpression(relevantParent) || core.types.isSpreadElement(relevantParent)) {
    const names = [];
    path.findParent(({
      node
    }) => {
      const name = extractName(node);

      if (name) {
        names.unshift(name);
      } // Traverse all the way to the root


      return false;
    });
    return names.join('_');
  } else {
    return extractName(relevantParent);
  }
};

const getRelevantCall = (node, namespaceImport, importIdentifiers) => {
  const {
    callee
  } = node;

  if (namespaceImport && core.types.isMemberExpression(callee) && core.types.isIdentifier(callee.object, {
    name: namespaceImport
  })) {
    return styleFunctions.find(exportName => core.types.isIdentifier(callee.property, {
      name: exportName
    }));
  } else {
    const importInfo = Array.from(importIdentifiers.entries()).find(([identifier]) => core.types.isIdentifier(callee, {
      name: identifier
    }));

    if (importInfo) {
      return importInfo[1];
    }
  }
};

function index () {
  return {
    pre({
      opts
    }) {
      if (!opts.filename) {
        // TODO Make error better
        throw new Error('Filename must be available');
      }

      this.isESM = false;
      this.isCssFile = integration.cssFileFilter.test(opts.filename);
      this.alreadyCompiled = false;
      this.importIdentifiers = new Map();
      this.namespaceImport = '';
      const packageInfo = integration.getPackageInfo(opts.cwd);

      if (!packageInfo.name) {
        throw new Error(`Closest package.json (${packageInfo.path}) must specify name`);
      }

      this.packageName = packageInfo.name; // Encode windows file paths as posix

      this.filePath = path.posix.join(...path.relative(packageInfo.dirname, opts.filename).split(path.sep));
    },

    visitor: {
      Program: {
        exit(path) {
          if (this.isCssFile && !this.alreadyCompiled) {
            // Wrap module with file scope calls
            const buildSetFileScope = this.isESM ? buildSetFileScopeESM : buildSetFileScopeCJS;
            path.unshiftContainer('body', buildSetFileScope({
              filePath: core.types.stringLiteral(this.filePath),
              packageName: core.types.stringLiteral(this.packageName)
            }));
            path.pushContainer('body', buildEndFileScope());
          }
        }

      },

      ImportDeclaration(path) {
        this.isESM = true;

        if (!this.isCssFile || this.alreadyCompiled) {
          // Bail early if file isn't a .css.ts file or the file has already been compiled
          return;
        }

        if (path.node.source.value === filescopePackageIdentifier) {
          // If file scope import is found it means the file has already been compiled
          this.alreadyCompiled = true;
          return;
        } else if (packageIdentifiers.has(path.node.source.value)) {
          path.node.specifiers.forEach(specifier => {
            if (core.types.isImportNamespaceSpecifier(specifier)) {
              this.namespaceImport = specifier.local.name;
            } else if (core.types.isImportSpecifier(specifier)) {
              const {
                imported,
                local
              } = specifier;
              const importName = core.types.isIdentifier(imported) ? imported.name : imported.value;

              if (styleFunctions.includes(importName)) {
                this.importIdentifiers.set(local.name, importName);
              }
            }
          });
        }
      },

      ExportDeclaration() {
        this.isESM = true;
      },

      CallExpression(path) {
        if (!this.isCssFile || this.alreadyCompiled) {
          // Bail early if file isn't a .css.ts file or the file has already been compiled
          return;
        }

        const {
          node
        } = path;

        if (core.types.isIdentifier(node.callee, {
          name: 'require'
        }) && core.types.isStringLiteral(node.arguments[0], {
          value: filescopePackageIdentifier
        })) {
          // If file scope import is found it means the file has already been compiled
          this.alreadyCompiled = true;
          return;
        }

        const usedExport = getRelevantCall(node, this.namespaceImport, this.importIdentifiers);

        if (usedExport && usedExport in debuggableFunctionConfig) {
          if (node.arguments.length < debuggableFunctionConfig[usedExport].maxParams) {
            const debugIdent = getDebugId(path);

            if (debugIdent) {
              node.arguments.push(core.types.stringLiteral(debugIdent));
            }
          }
        }
      }

    }
  };
}

exports["default"] = index;
