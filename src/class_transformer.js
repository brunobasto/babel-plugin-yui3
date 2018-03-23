/* eslint max-len: 0 */

import {NodePath} from 'babel-traverse';
import * as t from 'babel-types';

export default class ClassTransformer {
	constructor(path, file) {
		path = path || NodePath;

		const {scope, node, id, superClass} = path;

		this.body = [];
		this.file = file;
		this.node = node;
		this.path = path;
		this.scope = scope;

		this.classRef = id
			? t.identifier(id.name)
			: this.scope.generateUidIdentifier('class');
		this.superName = superClass || t.identifier('Function');
		this.hasSuper = !!superClass;
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