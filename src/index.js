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

const isYuiImport = node => node.source.value.startsWith('@yui');

const getYuiImport = node => node.source.value.replace('@yui/', '');

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
					const body = [];
					const namedImports = [];

					for (const path of path.get('body')) {
						const {node} = path;

						if (path.isImportDeclaration() && isYuiImport(node)) {
							if (path.node.specifiers.length) {
								path.node.specifiers.forEach(specifier => {
									namedImports.push(specifier.imported.name);
								});
							}

							requires.push(t.stringLiteral(getYuiImport(node)));
							path.remove();
						} else if (path.isExportDefaultDeclaration()) {
							const className = path.node.declaration.name;

							exportDeclarations.push(exportClassName(className));
							path.remove();
						} else if (path.isExportNamedDeclaration()) {
							exportDeclarations.push(
								...path.node.specifiers.map(specifier => {
									const className = specifier.local.name;
									return exportClassName(className);
								})
							);
							path.remove();
						} else if (path.isVariableDeclaration()) {
							const declaration = path.node.declarations[0];
							if (classNames.indexOf(declaration.id.name) > -1) {
								classDeclarations.push(path.node);
								path.remove();
							} else {
								body.push(path.node);
								path.remove();
							}
						} else {
							body.push(path.node);
							path.remove();
						}
					}

					path.pushContainer(
						'body',
						add(
							namedImports.map(namedImport => {
								return t.variableDeclaration('var', [
									t.variableDeclarator(
										t.identifier(namedImport),
										t.memberExpression(
											t.identifier('Y'),
											t.identifier(namedImport)
										)
									)
								]);
							}),
							body,
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