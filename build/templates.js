'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.add = add;

var _babelTemplate = require('babel-template');

var _babelTemplate2 = _interopRequireDefault(_babelTemplate);

var _babelTypes = require('babel-types');

var types = _interopRequireWildcard(_babelTypes);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var addTemplate = (0, _babelTemplate2.default)('\n  YUI.add(MODULE_NAME_STRING, function(Y) {\n    MODULE_BODY\n\n    EXPOSED\n  }, \'\', {\n    \'requires\': MODULE_REQUIRES\n  });\n');

function add(body, exposed, name, requires) {
  return addTemplate({
    EXPOSED: exposed,
    MODULE_BODY: body,
    MODULE_NAME_STRING: types.stringLiteral(name),
    MODULE_REQUIRES: types.arrayExpression(requires)
  });
};