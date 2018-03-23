import * as t from 'babel-types';
import {add} from './templates';
import ClassTransformer from './class_transformer';

export default function() {
	const requires = [];
	let className = '';

	return {
		visitor: {
			ClassExpression(path, state) {
				const classTransformer = new ClassTransformer(path, state.file);

				className = classTransformer.getName();

				path.replaceWith(classTransformer.build());
			},

			Program: {
				exit(path) {
					let body = null;
					let exposed = null;

					for (const path of path.get('body')) {
						const {node} = path;

						if (path.isImportDeclaration()) {
							requires.push(t.stringLiteral(node.source.value));
							path.remove();
						} else if (path.isVariableDeclaration()) {
							body = node;
							path.remove();
						}
					}

					if (body && className) {
						exposed = t.assignmentExpression(
							'=',
							t.identifier(`Y.${className}`),
							t.identifier(className)
						);

						path.unshiftContainer(
							'body',
							add(
								body,
								exposed,
								this.file.opts.basename,
								requires
							)
						);
					}
				}
			}
		}
	};
}