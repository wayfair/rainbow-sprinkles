'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var transformCss = require('@vanilla-extract/css/transformCss');
var evalCode = require('eval');
var javascriptStringify = require('javascript-stringify');
var isPlainObject = require('lodash/isPlainObject');
var outdent = require('outdent');
var crypto = require('crypto');
var zlib = require('zlib');
var util = require('util');
var path = require('path');
var findUp = require('find-up');
var fs = require('fs');
var esbuild = require('esbuild');

function _interopDefault (e) { return e && e.__esModule ? e : { 'default': e }; }

var evalCode__default = /*#__PURE__*/_interopDefault(evalCode);
var isPlainObject__default = /*#__PURE__*/_interopDefault(isPlainObject);
var outdent__default = /*#__PURE__*/_interopDefault(outdent);
var crypto__default = /*#__PURE__*/_interopDefault(crypto);
var path__default = /*#__PURE__*/_interopDefault(path);
var findUp__default = /*#__PURE__*/_interopDefault(findUp);

const hash = value => crypto__default["default"].createHash('md5').update(value).digest('hex');

const zip = util.promisify(zlib.gzip);
const unzip = util.promisify(zlib.gunzip); // The byte threshold for applying compression, below which compressing would out-weigh its value.

const compressionThreshold = 1000;
const compressionFlag = '#';
async function serializeCss(source) {
  if (source.length > compressionThreshold) {
    const compressedSource = await zip(source);
    return compressionFlag + compressedSource.toString('base64');
  }

  return Buffer.from(source, 'utf-8').toString('base64');
}
async function deserializeCss(source) {
  if (source.indexOf(compressionFlag) > -1) {
    const decompressedSource = await unzip(Buffer.from(source.replace(compressionFlag, ''), 'base64'));
    return decompressedSource.toString('utf-8');
  }

  return Buffer.from(source, 'base64').toString('utf-8');
}

const originalNodeEnv =         "production";
function stringifyFileScope({
  packageName,
  filePath
}) {
  return packageName ? `${filePath}$$$${packageName}` : filePath;
}
function parseFileScope(serialisedFileScope) {
  const [filePath, packageName] = serialisedFileScope.split('$$$');
  return {
    filePath,
    packageName
  };
}
async function processVanillaFile({
  source,
  filePath,
  outputCss = true,
  identOption = 'short' ,
  serializeVirtualCssPath
}) {
  const cssByFileScope = new Map();
  const localClassNames = new Set();
  const composedClassLists = [];
  const usedCompositions = new Set();
  const cssAdapter = {
    appendCss: (css, fileScope) => {
      if (outputCss) {
        var _cssByFileScope$get;

        const serialisedFileScope = stringifyFileScope(fileScope);
        const fileScopeCss = (_cssByFileScope$get = cssByFileScope.get(serialisedFileScope)) !== null && _cssByFileScope$get !== void 0 ? _cssByFileScope$get : [];
        fileScopeCss.push(css);
        cssByFileScope.set(serialisedFileScope, fileScopeCss);
      }
    },
    registerClassName: className => {
      localClassNames.add(className);
    },
    registerComposition: composedClassList => {
      composedClassLists.push(composedClassList);
    },
    markCompositionUsed: identifier => {
      usedCompositions.add(identifier);
    },
    onEndFileScope: () => {},
    getIdentOption: () => identOption
  };
  const currentNodeEnv =         "production"; // Vite sometimes modifies NODE_ENV which causes different versions (e.g. dev/prod) of vanilla packages to be loaded
  // This can cause CSS to be bound to the wrong instance, resulting in no CSS output
  // To get around this we set the NODE_ENV back to the original value ONLY during eval

  process.env.NODE_ENV = originalNodeEnv;
  const adapterBoundSource = `
    require('@vanilla-extract/css/adapter').setAdapter(__adapter__);
    ${source}
  `;
  const evalResult = evalCode__default["default"](adapterBoundSource, filePath, {
    console,
    process,
    __adapter__: cssAdapter
  }, true);
  process.env.NODE_ENV = currentNodeEnv;
  const cssImports = [];

  for (const [serialisedFileScope, fileScopeCss] of cssByFileScope) {
    const fileScope = parseFileScope(serialisedFileScope);
    const css = transformCss.transformCss({
      localClassNames: Array.from(localClassNames),
      composedClassLists,
      cssObjs: fileScopeCss
    }).join('\n');
    const fileName = `${fileScope.packageName ? `${fileScope.packageName}/${fileScope.filePath}` : fileScope.filePath}.vanilla.css`;
    let virtualCssFilePath;

    if (serializeVirtualCssPath) {
      const serializedResult = serializeVirtualCssPath({
        fileName,
        fileScope,
        source: css
      });

      if (typeof serializedResult === 'string') {
        virtualCssFilePath = serializedResult;
      } else {
        virtualCssFilePath = await serializedResult;
      }
    } else {
      const serializedCss = await serializeCss(css);
      virtualCssFilePath = `import '${fileName}?source=${serializedCss}';`;
    }

    cssImports.push(virtualCssFilePath);
  } // We run this code inside eval as jest seems to create a difrerent instance of the adapter file
  // for requires executed within the eval and all CSS can be lost.


  evalCode__default["default"](`const { removeAdapter } = require('@vanilla-extract/css/adapter');
    // Backwards compat with older versions of @vanilla-extract/css
    if (removeAdapter) {
      removeAdapter();
    }
  `, filePath, {
    console,
    process
  }, true);
  const unusedCompositions = composedClassLists.filter(({
    identifier
  }) => !usedCompositions.has(identifier)).map(({
    identifier
  }) => identifier);
  const unusedCompositionRegex = unusedCompositions.length > 0 ? RegExp(`(${unusedCompositions.join('|')})\\s`, 'g') : null;
  return serializeVanillaModule(cssImports, evalResult, unusedCompositionRegex);
}

function stringifyExports(recipeImports, value, unusedCompositionRegex) {
  return javascriptStringify.stringify(value, (value, _indent, next) => {
    const valueType = typeof value;

    if (valueType === 'boolean' || valueType === 'number' || valueType === 'undefined' || value === null || Array.isArray(value) || isPlainObject__default["default"](value)) {
      return next(value);
    }

    if (valueType === 'string') {
      return next(unusedCompositionRegex ? value.replace(unusedCompositionRegex, '') : value);
    }

    if (valueType === 'function' && (value.__function_serializer__ || value.__recipe__)) {
      const {
        importPath,
        importName,
        args
      } = value.__function_serializer__ || value.__recipe__;

      if (typeof importPath !== 'string' || typeof importName !== 'string' || !Array.isArray(args)) {
        throw new Error('Invalid recipe');
      }

      try {
        const hashedImportName = `_${hash(`${importName}${importPath}`).slice(0, 5)}`;
        recipeImports.add(`import { ${importName} as ${hashedImportName} } from '${importPath}';`);
        return `${hashedImportName}(${args.map(arg => stringifyExports(recipeImports, arg, unusedCompositionRegex)).join(',')})`;
      } catch (err) {
        console.error(err);
        throw new Error('Invalid recipe.');
      }
    }

    throw new Error(outdent__default["default"]`
        Invalid exports.

        You can only export plain objects, arrays, strings, numbers and null/undefined.
      `);
  }, 0, {
    references: true,
    // Allow circular references
    maxDepth: Infinity,
    maxValues: Infinity
  });
}

function serializeVanillaModule(cssImports, exports, unusedCompositionRegex) {
  const recipeImports = new Set();
  const moduleExports = Object.keys(exports).map(key => key === 'default' ? `export default ${stringifyExports(recipeImports, exports[key], unusedCompositionRegex)};` : `export var ${key} = ${stringifyExports(recipeImports, exports[key], unusedCompositionRegex)};`);
  const outputCode = [...cssImports, ...recipeImports, ...moduleExports];
  return outputCode.join('\n');
}

async function getSourceFromVirtualCssFile(id) {
  var _id$match;

  const match = (_id$match = id.match(/^(?<fileName>.*)\?source=(?<source>.*)$/)) !== null && _id$match !== void 0 ? _id$match : [];

  if (!match || !match.groups) {
    throw new Error('No source in vanilla CSS file');
  }

  const source = await deserializeCss(match.groups.source);
  return {
    fileName: match.groups.fileName,
    source
  };
}

function getClosestPackageInfo(directory) {
  const packageJsonPath = findUp__default["default"].sync('package.json', {
    cwd: directory
  });

  if (packageJsonPath) {
    const {
      name
    } = require(packageJsonPath);

    return {
      name,
      path: packageJsonPath,
      dirname: path__default["default"].dirname(packageJsonPath)
    };
  }
}

const packageInfoCache = new Map();
function getPackageInfo(cwd) {
  const resolvedCwd = cwd !== null && cwd !== void 0 ? cwd : process.cwd();
  const cachedValue = packageInfoCache.get(resolvedCwd);

  if (cachedValue) {
    return cachedValue;
  }

  let packageInfo = getClosestPackageInfo(resolvedCwd);

  while (packageInfo && !packageInfo.name) {
    packageInfo = getClosestPackageInfo(path__default["default"].resolve(packageInfo.dirname, '..'));
  }

  if (!packageInfo || !packageInfo.name) {
    throw new Error(`Couldn't find parent package.json with a name field from '${resolvedCwd}'`);
  }

  packageInfoCache.set(resolvedCwd, packageInfo);
  return packageInfo;
}

// Vite adds a "?used" to CSS files it detects, this isn't relevant for
// .css.ts files but it's added anyway so we need to allow for it in the file match
const cssFileFilter = /\.css\.(js|mjs|jsx|ts|tsx)(\?used)?$/;
const virtualCssFileFilter = /\.vanilla\.css\?source=.*$/;

function addFileScope({
  source,
  filePath,
  packageInfo
}) {
  if (source.indexOf('@vanilla-extract/css/fileScope') > -1) {
    return {
      source,
      updated: false
    };
  } // Encode windows file paths as posix


  const normalizedPath = path.posix.join(...path.relative(packageInfo.dirname, filePath).split(path.sep));
  const packageName = packageInfo.name ? `"${packageInfo.name}"` : 'undefined';
  const contents = `
    import { setFileScope, endFileScope } from "@vanilla-extract/css/fileScope";
    setFileScope("${normalizedPath}", ${packageName});
    ${source}
    endFileScope();
  `;
  return {
    source: contents,
    updated: true
  };
}

const vanillaExtractFilescopePlugin = () => ({
  name: 'vanilla-extract-filescope',

  setup(build) {
    const packageInfo = getPackageInfo(build.initialOptions.absWorkingDir);
    build.onLoad({
      filter: cssFileFilter
    }, async ({
      path: path$1
    }) => {
      const originalSource = await fs.promises.readFile(path$1, 'utf-8');
      const {
        source,
        updated
      } = addFileScope({
        source: originalSource,
        filePath: path$1,
        packageInfo
      });

      if (updated) {
        return {
          contents: source,
          loader: path$1.match(/\.(ts|tsx)$/i) ? 'ts' : undefined,
          resolveDir: path.dirname(path$1)
        };
      }
    });
  }

});
async function compile({
  filePath,
  cwd = process.cwd(),
  externals = []
}) {
  const result = await esbuild.build({
    entryPoints: [filePath],
    metafile: true,
    bundle: true,
    external: ['@vanilla-extract', ...externals],
    platform: 'node',
    write: false,
    plugins: [vanillaExtractFilescopePlugin()],
    absWorkingDir: cwd
  });
  const {
    outputFiles,
    metafile
  } = result;

  if (!outputFiles || outputFiles.length !== 1) {
    throw new Error('Invalid child compilation');
  }

  return {
    source: outputFiles[0].text,
    watchFiles: Object.keys((metafile === null || metafile === void 0 ? void 0 : metafile.inputs) || {}).map(filePath => path.join(cwd, filePath))
  };
}

exports.addFileScope = addFileScope;
exports.compile = compile;
exports.cssFileFilter = cssFileFilter;
exports.deserializeCss = deserializeCss;
exports.getPackageInfo = getPackageInfo;
exports.getSourceFromVirtualCssFile = getSourceFromVirtualCssFile;
exports.hash = hash;
exports.parseFileScope = parseFileScope;
exports.processVanillaFile = processVanillaFile;
exports.serializeCss = serializeCss;
exports.stringifyFileScope = stringifyFileScope;
exports.vanillaExtractFilescopePlugin = vanillaExtractFilescopePlugin;
exports.virtualCssFileFilter = virtualCssFileFilter;
