"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var isNamespacedStyleName = function isNamespacedStyleName(styleName) {
  return styleName.indexOf('.') !== -1;
};

var getClassNameForNamespacedStyleName = function getClassNameForNamespacedStyleName(styleName, styleModuleImportMap, handleMissingStyleNameOption) {
  // Note:
  // Do not use the desctructing syntax with Babel.
  // Desctructing adds _slicedToArray helper.
  var styleNameParts = styleName.split('.');
  var importName = styleNameParts[0];
  var moduleName = styleNameParts[1];
  var handleMissingStyleName = handleMissingStyleNameOption || 'throw';

  if (!moduleName) {
    if (handleMissingStyleName === 'throw') {
      throw new Error('Invalid style name.');
    } else if (handleMissingStyleName === 'warn') {
      // eslint-disable-next-line no-console
      console.warn('Invalid style name.');
    } else {
      return null;
    }
  }

  if (!styleModuleImportMap[importName]) {
    if (handleMissingStyleName === 'throw') {
      throw new Error('CSS module import does not exist.');
    } else if (handleMissingStyleName === 'warn') {
      // eslint-disable-next-line no-console
      console.warn('CSS module import does not exist.');
    } else {
      return null;
    }
  }

  if (!styleModuleImportMap[importName][moduleName]) {
    if (handleMissingStyleName === 'throw') {
      throw new Error('CSS module does not exist.');
    } else if (handleMissingStyleName === 'warn') {
      // eslint-disable-next-line no-console
      console.warn('CSS module does not exist.');
    } else {
      return null;
    }
  }

  return styleModuleImportMap[importName][moduleName];
};

var _default = function _default(styleNameValue, styleModuleImportMap, options) {
  var styleModuleImportMapKeys = Object.keys(styleModuleImportMap);
  var handleMissingStyleName = options && options.handleMissingStyleName;
  return styleNameValue.split(' ').filter(function (styleName) {
    return styleName;
  }).map(function (styleName) {
    if (isNamespacedStyleName(styleName)) {
      return getClassNameForNamespacedStyleName(styleName, styleModuleImportMap, handleMissingStyleName);
    }

    if (styleModuleImportMapKeys.length === 0) {
      throw new Error('Cannot use styleName attribute without importing at least one stylesheet.');
    }

    if (styleModuleImportMapKeys.length > 1) {
      throw new Error('Cannot use anonymous style name with more than one stylesheet import.');
    }

    var styleModuleMap = styleModuleImportMap[styleModuleImportMapKeys[0]];

    if (!styleModuleMap[styleName]) {
      if (handleMissingStyleName === 'throw') {
        throw new Error('Could not resolve the styleName \'' + styleName + '\'.');
      }

      if (handleMissingStyleName === 'warn') {
        // eslint-disable-next-line no-console
        console.warn('Could not resolve the styleName \'' + styleName + '\'.');
      }
    }

    return styleModuleMap[styleName];
  }).filter(function (className) {
    // Remove any styles which could not be found (if handleMissingStyleName === 'ignore')
    return className;
  }).join(' ');
};

exports.default = _default;

//# sourceMappingURL=getClassName.js.map