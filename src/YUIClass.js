/* eslint max-len: 0 */

import {NodePath} from 'babel-traverse';
import * as t from 'babel-types';

const findSuperCalls = {
	Super(path) {
		if (path.parentPath.isMemberExpression()) {
			this.push(path.parentPath);
		}
	}
};

export default class ClassTransformer {
	constructor(path) {
		path = path || NodePath;

		const {scope, node} = path;

		this.body = [];
		this.node = node;
		this.path = path;
		this.scope = scope;

		this.classRef = node.id
			? t.identifier(node.id.name)
			: this.scope.generateUidIdentifier('class');
		this.superName = node.superClass || t.identifier('Y.Base');
		this.hasSuper = !!node.superClass;
	}

	build() {
		const closureArgs = [];
		const closureParams = [];
		const {body, hasSuper, scope} = this;
		let {superName} = this;

		if (hasSuper) {
			closureArgs.push(superName);

			superName = scope.generateUidIdentifierBasedOnNode(superName);
			closureParams.push(superName);

			this.superName = superName;
		}

		const classBody = this.buildClass();

		body.push(classBody);

		const container = t.functionExpression(
			null,
			closureParams,
			t.blockStatement(body)
		);

		return t.callExpression(container, closureArgs);
	}

	buildClass() {
		const className = this.getName();

		const baseCreate = t.callExpression(t.identifier('Y.Base.create'), [
			t.stringLiteral(className),
			this.superName,
			this.buildAugments(),
			this.buildMethods(),
			this.buildAttrs()
		]);

		return t.returnStatement(baseCreate);
	}

	buildMethods() {
		const methods = [];

		for (const path of this.path.get('body.body')) {
			const {node} = path;

			if (t.isClassMethod(node)) {
				const superClassMethodCalls = [];
				path.traverse(findSuperCalls, superClassMethodCalls);

				superClassMethodCalls.forEach(superPath =>
					this.replaceSuperCall(superPath)
				);

				methods.push(
					t.objectMethod('method', node.key, node.params, node.body)
				);
			}
		}

		return t.objectExpression(methods);
	}

	buildAugments() {
		for (const path of this.path.get('body.body')) {
			const {node} = path;

			if (t.isClassProperty(node) && node.key.name === 'AUGMENTS') {
				return node.value;
			}
		}

		return t.arrayExpression([]);
	}

	buildAttrs() {
		const statics = [];

		for (const path of this.path.get('body.body')) {
			const {node} = path;

			if (t.isClassProperty(node) && node.key.name !== 'AUGMENTS') {
				statics.push(t.objectProperty(node.key, node.value));
			}
		}

		return t.objectExpression(statics);
	}

	hasModuleName() {
		return this.getModuleName() !== null;
	}

	getModuleName() {
		if (!this.node.decorators) {
			return null;
		}

		const moduleNameExpression = this.node.decorators
			.filter(decorator => t.isCallExpression(decorator.expression))
			.map(decorator => decorator.expression)
			.find(expression => expression.callee.name === 'moduleName');

		if (moduleNameExpression.arguments.length > 0) {
			return moduleNameExpression.arguments[0].value;
		}

		return null;
	}

	getName() {
		return this.classRef.name;
	}

	replaceSuperCall(superPath) {
		const methodName = superPath.container.callee.property.name;

		const applyMethod = t.identifier(
			`${this.getName()}.superclass.${methodName}.apply`
		);

		const args = superPath.container.arguments;

		superPath.parentPath.replaceWith(
			t.callExpression(applyMethod, [
				t.identifier('this'),
				t.arrayExpression(args)
			])
		);
	}
}