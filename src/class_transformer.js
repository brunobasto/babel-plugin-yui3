/* eslint max-len: 0 */

import {NodePath} from 'babel-traverse';
import * as t from 'babel-types';

export default class ClassTransformer {
	constructor(path, file) {
		path = path || NodePath;

		this.scope = path.scope;
		this.node = path.node;
		this.path = path;
		this.file = file;
		this.body = [];
		this.classRef = this.node.id
			? t.identifier(this.node.id.name)
			: this.scope.generateUidIdentifier('class');
		this.superName = this.node.superClass || t.identifier('Function');
		this.hasSuper = !!this.node.superClass;
	}

	build() {
		const closureArgs = [];
		const closureParams = [];
		let superName = this.superName;

		if (this.hasSuper) {
			closureArgs.push(superName);

			superName = this.scope.generateUidIdentifierBasedOnNode(superName);
			closureParams.push(superName);

			this.superName = superName;
		}

		const classBody = this.buildClass();

		this.body.push(classBody);

		const container = t.functionExpression(
			null,
			closureParams,
			t.blockStatement(this.body)
		);

		return t.callExpression(container, closureArgs);
	}

	buildClass() {
		const className = this.getName();

		const baseCreate = t.callExpression(t.identifier('Y.Base.create'), [
			t.stringLiteral(className),
			this.superName,
			t.arrayExpression([]),
			this.buildMethods(),
			t.objectExpression([])
		]);

		return t.returnStatement(baseCreate);
	}

	buildMethods() {
		const methods = [];

		for (const path of this.path.get('body.body')) {
			const {node} = path;

			if (t.isClassMethod(node)) {
				methods.push(
					t.objectMethod('method', node.key, node.params, node.body)
				);
			}
		}

		return t.objectExpression(methods);
	}

	getName() {
		return this.classRef.name;
	}
}