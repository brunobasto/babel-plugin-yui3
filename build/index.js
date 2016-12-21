'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function () {
	var requires = [];
	var className = '';

	return {
		visitor: {
			ClassExpression: function ClassExpression(path, state) {
				var classExpression = new _class_transformer2.default(path, state.file);

				className = classExpression.getName();

				path.replaceWith(classExpression.run());
			},


			Program: {
				exit: function exit(path) {
					var body = null;
					var exposed = null;

					var _iteratorNormalCompletion = true;
					var _didIteratorError = false;
					var _iteratorError = undefined;

					try {
						for (var _iterator = path.get('body')[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
							var _path = _step.value;
							var node = _path.node;


							if (_path.isImportDeclaration()) {
								requires.push(t.stringLiteral(node.source.value));
								_path.remove();
							} else if (_path.isVariableDeclaration()) {
								body = node;
								_path.remove();
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

					if (body && className) {
						exposed = t.assignmentExpression("=", t.identifier('Y.' + className), t.identifier(className));

						path.unshiftContainer('body', (0, _templates.add)(body, exposed, this.file.opts.basename, requires));
					}
				}
			}
		}
	};
};

var _babelTypes = require('babel-types');

var t = _interopRequireWildcard(_babelTypes);

var _templates = require('./templates');

var _path2 = require('path');

var _path3 = _interopRequireDefault(_path2);

var _class_transformer = require('./class_transformer');

var _class_transformer2 = _interopRequireDefault(_class_transformer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }