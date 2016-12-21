import * as t from 'babel-types';
import {add, use} from './templates';
import nodePath from 'path';
import ClassTransformer from './class_transformer';

export default function() {
	let requires = [];
	let className = '';

	return {
		visitor: {
			ClassExpression(path, state) {
				var classExpression = new ClassTransformer(path, state.file);

				className = classExpression.getName();

				path.replaceWith(classExpression.run());
			},

			Program: {
				exit(path) {
					let body = null;
					let exposed = null;

					for (let path of path.get('body')) {
						const { node } = path;

						if (path.isImportDeclaration()) {
							requires.push(t.stringLiteral(node.source.value));
							path.remove();
						}
						else if (path.isVariableDeclaration()) {
							body = node;
							path.remove();
						}
					}

					if (body && className) {
						exposed = t.assignmentExpression("=", t.identifier('Y.' + className), t.identifier(className));

						path.unshiftContainer('body', add(body, exposed, this.file.opts.basename, requires));
					}
				}
			}
		}
	};
}
