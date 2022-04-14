import { posix, relative, sep } from 'path';
import { types } from '@babel/core';
import template from '@babel/template';
import { cssFileFilter, getPackageInfo } from '@vanilla-extract/integration';

const packageIdentifiers = new Set(['@vanilla-extract/css', '@vanilla-extract/recipes']);
const filescopePackageIdentifier = '@vanilla-extract/css/fileScope';
const buildSetFileScopeESM = template(`
  import * as __vanilla_filescope__ from '${filescopePackageIdentifier}'
  __vanilla_filescope__.setFileScope(%%filePath%%, %%packageName%%)
`);
const buildSetFileScopeCJS = template(`
  const __vanilla_filescope__ = require('${filescopePackageIdentifier}');
  __vanilla_filescope__.setFileScope(%%filePath%%, %%packageName%%)
`);
const buildEndFileScope = template(`__vanilla_filescope__.endFileScope()`);
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
  if (types.isObjectProperty(node) && types.isIdentifier(node.key)) {
    return node.key.name;
  } else if ((types.isVariableDeclarator(node) || types.isFunctionDeclaration(node)) && types.isIdentifier(node.id)) {
    return node.id.name;
  } else if (types.isExportDefaultDeclaration(node)) {
    return 'default';
  } else if (types.isVariableDeclarator(node) && types.isArrayPattern(node.id) && types.isIdentifier(node.id.elements[0])) {
    return node.id.elements[0].name;
  }
};

const getDebugId = path => {
  const firstRelevantParentPath = path.findParent(({
    node
  }) => !(types.isCallExpression(node) || types.isSequenceExpression(node)));

  if (!firstRelevantParentPath) {
    return;
  } // Special case: Handle `export const [themeClass, vars] = createTheme({});`
  // when it's already been compiled into this:
  //
  // var _createTheme = createTheme({}),
  //   _createTheme2 = _slicedToArray(_createTheme, 2),
  //   themeClass = _createTheme2[0],
  //   vars = _createTheme2[1];


  if (types.isVariableDeclaration(firstRelevantParentPath.parent) && firstRelevantParentPath.parent.declarations.length === 4) {
    const [themeDeclarator,, classNameDeclarator] = firstRelevantParentPath.parent.declarations;

    if (types.isCallExpression(themeDeclarator.init) && types.isIdentifier(themeDeclarator.init.callee, {
      name: 'createTheme'
    }) && types.isVariableDeclarator(classNameDeclarator) && types.isIdentifier(classNameDeclarator.id)) {
      return classNameDeclarator.id.name;
    }
  }

  const relevantParent = firstRelevantParentPath.node;

  if (types.isObjectProperty(relevantParent) || types.isReturnStatement(relevantParent) || types.isArrowFunctionExpression(relevantParent) || types.isArrayExpression(relevantParent) || types.isSpreadElement(relevantParent)) {
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

  if (namespaceImport && types.isMemberExpression(callee) && types.isIdentifier(callee.object, {
    name: namespaceImport
  })) {
    return styleFunctions.find(exportName => types.isIdentifier(callee.property, {
      name: exportName
    }));
  } else {
    const importInfo = Array.from(importIdentifiers.entries()).find(([identifier]) => types.isIdentifier(callee, {
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
      this.isCssFile = cssFileFilter.test(opts.filename);
      this.alreadyCompiled = false;
      this.importIdentifiers = new Map();
      this.namespaceImport = '';
      const packageInfo = getPackageInfo(opts.cwd);

      if (!packageInfo.name) {
        throw new Error(`Closest package.json (${packageInfo.path}) must specify name`);
      }

      this.packageName = packageInfo.name; // Encode windows file paths as posix

      this.filePath = posix.join(...relative(packageInfo.dirname, opts.filename).split(sep));
    },

    visitor: {
      Program: {
        exit(path) {
          if (this.isCssFile && !this.alreadyCompiled) {
            // Wrap module with file scope calls
            const buildSetFileScope = this.isESM ? buildSetFileScopeESM : buildSetFileScopeCJS;
            path.unshiftContainer('body', buildSetFileScope({
              filePath: types.stringLiteral(this.filePath),
              packageName: types.stringLiteral(this.packageName)
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
            if (types.isImportNamespaceSpecifier(specifier)) {
              this.namespaceImport = specifier.local.name;
            } else if (types.isImportSpecifier(specifier)) {
              const {
                imported,
                local
              } = specifier;
              const importName = types.isIdentifier(imported) ? imported.name : imported.value;

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

        if (types.isIdentifier(node.callee, {
          name: 'require'
        }) && types.isStringLiteral(node.arguments[0], {
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
              node.arguments.push(types.stringLiteral(debugIdent));
            }
          }
        }
      }

    }
  };
}

export { index as default };
