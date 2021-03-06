import * as t from 'babel-types';
import YUIClass from './YUIClass';
import {addPost} from './templates';

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
	let isAddYui = false;
	const requires = [];
	const classNames = [];
	const classDeclarations = [];
	const exportDeclarations = [];
	let moduleName;

	return {
		visitor: {
			Class(path, state) {
				const yuiClass = new YUIClass(path, state.file);

				classNames.push(yuiClass.getName());

				const classBody = yuiClass.build();

				const classDeclaration = t.variableDeclaration('var', [
					t.variableDeclarator(
						t.identifier(yuiClass.getName()),
						classBody
					)
				]);

				if (yuiClass.hasModuleName()) {
					moduleName = yuiClass.getModuleName();
				}

				path.replaceWith(classDeclaration);

				classDeclarations.push(classDeclaration);
			},

			ImportDeclaration(path) {
				if (isYuiImport(path.node)) {
					isAddYui = true;
				}
			},

			Program: {
				exit(path) {
					if (!isAddYui) {
						return;
					}

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
						} else {
							if (!path.isImportDeclaration()) {
								body.push(path.node);
								path.remove();
							}
						}
					}

					path.pushContainer(
						'body',
						addPost(
							moduleName || this.file.opts.basename,
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
							exportDeclarations,
							requires
						)
					);

					isAddYui = false;
				}
			}
		}
	};
}