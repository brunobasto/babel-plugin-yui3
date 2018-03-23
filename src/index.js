import * as t from 'babel-types';
import ClassTransformer from './class_transformer';
import {add} from './templates';

function exportClassName(className) {
	return t.assignmentExpression(
		'=',
		t.memberExpression(t.identifier('Y'), t.identifier(className)),
		t.identifier(className)
	);
}

export default function() {
	const requires = [];
	const classNames = [];
	const classDeclarations = [];
	const exportDeclarations = [];

	return {
		visitor: {
			Class(path, state) {
				const classTransformer = new ClassTransformer(path, state.file);

				classNames.push(classTransformer.getName());

				const classBody = classTransformer.build();

				path.remove();

				classDeclarations.push(
					t.variableDeclaration('var', [
						t.variableDeclarator(
							t.identifier(classTransformer.getName()),
							classBody
						)
					])
				);
			},

			Program: {
				exit(path) {
					for (const path of path.get('body')) {
						const {node} = path;

						if (path.isImportDeclaration()) {
							requires.push(t.stringLiteral(node.source.value));
							path.remove();
						} else if (path.isExportDefaultDeclaration()) {
							exportDeclarations.push(
								exportClassName(path.node.declaration.name)
							);
							path.remove();
						} else if (path.isExportNamedDeclaration()) {
							exportDeclarations.push(
								...path.node.specifiers.map(specifier => {
									return exportClassName(
										specifier.local.name
									);
								})
							);
							path.remove();
						} else if (path.isVariableDeclaration()) {
							const declaration = path.node.declarations[0];
							if (classNames.indexOf(declaration.id.name) > -1) {
								classDeclarations.push(path.node);
								path.remove();
							}
						}
					}

					path.pushContainer(
						'body',
						add(
							classDeclarations,
							exportDeclarations,
							this.file.opts.basename,
							requires
						)
					);
				}
			}
		}
	};
}