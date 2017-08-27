'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('path');

var _fs = require('fs');

var _nodeSass = require('node-sass');

var _nodeSass2 = _interopRequireDefault(_nodeSass);

var _postcss = require('postcss');

var _postcss2 = _interopRequireDefault(_postcss);

var _genericNames = require('generic-names');

var _genericNames2 = _interopRequireDefault(_genericNames);

var _postcssModulesExtractImports = require('postcss-modules-extract-imports');

var _postcssModulesExtractImports2 = _interopRequireDefault(_postcssModulesExtractImports);

var _postcssModulesLocalByDefault = require('postcss-modules-local-by-default');

var _postcssModulesLocalByDefault2 = _interopRequireDefault(_postcssModulesLocalByDefault);

var _postcssModulesParser = require('postcss-modules-parser');

var _postcssModulesParser2 = _interopRequireDefault(_postcssModulesParser);

var _postcssModulesScope = require('postcss-modules-scope');

var _postcssModulesScope2 = _interopRequireDefault(_postcssModulesScope);

var _postcssModulesValues = require('postcss-modules-values');

var _postcssModulesValues2 = _interopRequireDefault(_postcssModulesValues);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const getFiletypeOptions = (cssSourceFilePath, filetypes) => {
  const extension = cssSourceFilePath.substr(cssSourceFilePath.lastIndexOf('.'));
  const filetype = filetypes ? filetypes[extension] : null;

  return filetype;
};

// eslint-disable-next-line flowtype/no-weak-types
const getSyntax = filetypeOptions => {
  if (!filetypeOptions || !filetypeOptions.syntax) {
    return null;
  }

  // eslint-disable-next-line import/no-dynamic-require, global-require
  return require(filetypeOptions.syntax);
};

// eslint-disable-next-line flowtype/no-weak-types
const getExtraPlugins = filetypeOptions => {
  if (!filetypeOptions || !filetypeOptions.plugins) {
    return [];
  }

  return filetypeOptions.plugins.map(plugin => {
    // eslint-disable-next-line import/no-dynamic-require, global-require
    return require(plugin);
  });
};

const getTokens = (runner, cssSourceFilePath, filetypeOptions, context, resolve) => {
  const extension = cssSourceFilePath.substr(cssSourceFilePath.lastIndexOf('.'));
  // eslint-disable-next-line flowtype/no-weak-types
  const options = {
    from: cssSourceFilePath
  };

  if (filetypeOptions) {
    options.syntax = getSyntax(filetypeOptions);
  }

  let fileContents = '';

  if (extension === '.scss') {
    fileContents = _nodeSass2.default.renderSync({
      file: cssSourceFilePath,
      includePaths: [`${context}/${resolve}`]
    });
    fileContents = fileContents.css.toString();
  } else {
    fileContents = (0, _fs.readFileSync)(cssSourceFilePath, 'utf-8');
  }

  const lazyResult = runner.process(fileContents, options);

  lazyResult.warnings().forEach(message => {
    // eslint-disable-next-line no-console
    console.warn(message.text);
  });

  return lazyResult.root.tokens;
};

exports.default = (cssSourceFilePath, options) => {
  // eslint-disable-next-line prefer-const
  let runner;

  let generateScopedName;

  if (options.generateScopedName && typeof options.generateScopedName === 'function') {
    generateScopedName = options.generateScopedName;
  } else {
    generateScopedName = (0, _genericNames2.default)(options.generateScopedName || '[path]___[name]__[local]___[hash:base64:5]', {
      context: options.context || process.cwd()
    });
  }

  const filetypeOptions = getFiletypeOptions(cssSourceFilePath, options.filetypes);

  const fetch = (to, from) => {
    const fromDirectoryPath = (0, _path.dirname)(from);
    const toPath = (0, _path.resolve)(fromDirectoryPath, to);

    return getTokens(runner, toPath, filetypeOptions, options.context, options.resolve);
  };

  const extraPlugins = getExtraPlugins(filetypeOptions);

  const plugins = [...extraPlugins, _postcssModulesValues2.default, _postcssModulesLocalByDefault2.default, _postcssModulesExtractImports2.default, new _postcssModulesScope2.default({
    generateScopedName
  }), new _postcssModulesParser2.default({
    fetch
  })];

  runner = (0, _postcss2.default)(plugins);

  return getTokens(runner, cssSourceFilePath, filetypeOptions, options.context, options.resolve);
};
//# sourceMappingURL=requireCssModule.js.map