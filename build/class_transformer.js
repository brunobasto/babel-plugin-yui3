"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /* eslint max-len: 0 */

var _babelTraverse = require("babel-traverse");

var _babelHelperReplaceSupers = require("babel-helper-replace-supers");

var _babelHelperReplaceSupers2 = _interopRequireDefault(_babelHelperReplaceSupers);

var _babelHelperOptimiseCallExpression = require("babel-helper-optimise-call-expression");

var _babelHelperOptimiseCallExpression2 = _interopRequireDefault(_babelHelperOptimiseCallExpression);

var _babelHelperDefineMap = require("babel-helper-define-map");

var defineMap = _interopRequireWildcard(_babelHelperDefineMap);

var _babelTemplate = require("babel-template");

var _babelTemplate2 = _interopRequireDefault(_babelTemplate);

var _babelTypes = require("babel-types");

var t = _interopRequireWildcard(_babelTypes);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ClassTransformer = function () {
  function ClassTransformer(path, file) {
    _classCallCheck(this, ClassTransformer);

    path = path || _babelTraverse.NodePath;

    this.scope = path.scope;
    this.node = path.node;
    this.path = path;
    this.file = file;
    this.body = [];
    this.classRef = this.node.id ? t.identifier(this.node.id.name) : this.scope.generateUidIdentifier("class");
    this.superName = this.node.superClass || t.identifier("Function");
    this.isDerived = !!this.node.superClass;
  }

  _createClass(ClassTransformer, [{
    key: "getName",
    value: function getName() {
      return this.classRef.name;
    }
  }, {
    key: "run",
    value: function run() {
      var superName = this.superName;
      var closureParams = [];
      var closureArgs = [];

      if (this.isDerived) {
        closureArgs.push(superName);

        superName = this.scope.generateUidIdentifierBasedOnNode(superName);
        closureParams.push(superName);

        this.superName = superName;
      }

      this.buildBody();

      var container = t.functionExpression(null, closureParams, t.blockStatement(this.body));

      return t.callExpression(container, closureArgs);
    }
  }, {
    key: "buildBody",
    value: function buildBody() {
      var body = this.body;
      var className = this.classRef.name;

      var baseCreate = t.callExpression(t.identifier('Y.Base.create'), [t.stringLiteral(className), this.superName, t.arrayExpression([]), this.buildMethods(), t.objectExpression([])]);

      body.push(t.returnStatement(baseCreate));
    }
  }, {
    key: "buildMethods",
    value: function buildMethods() {
      var classBodyPaths = this.path.get("body.body");
      var methods = [];

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = classBodyPaths[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var path = _step.value;

          var node = path.node;

          if (t.isClassMethod(node)) {
            methods.push(t.objectMethod("method", node.key, node.params, node.body));
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return t.objectExpression(methods);
    }
  }]);

  return ClassTransformer;
}();

exports.default = ClassTransformer;