/* eslint max-len: 0 */

import { NodePath } from "babel-traverse";
import * as t from "babel-types";

export default class ClassTransformer {
  constructor(path, file) {
    path = path || NodePath;

    this.scope = path.scope;
    this.node = path.node;
    this.path = path;
    this.file = file;
    this.body = [];
    this.classRef = this.node.id ? t.identifier(this.node.id.name) : this.scope.generateUidIdentifier("class");
    this.superName = this.node.superClass || t.identifier("Function");
    this.isDerived = !!this.node.superClass;
  }

  getName() {
    return this.classRef.name;
  }

  run() {
    let superName = this.superName;
    let closureParams = [];
    let closureArgs = [];

    if (this.isDerived) {
      closureArgs.push(superName);

      superName = this.scope.generateUidIdentifierBasedOnNode(superName);
      closureParams.push(superName);

      this.superName = superName;
    }

    this.buildBody();

    let container = t.functionExpression(null, closureParams, t.blockStatement(this.body));

    return t.callExpression(container, closureArgs);
  }

  buildBody() {
    const body = this.body;
    const className = this.classRef.name;

    var baseCreate = t.callExpression(
      t.identifier('Y.Base.create'),
      [
        t.stringLiteral(className),
        this.superName,
        t.arrayExpression([]),
        this.buildMethods(),
        t.objectExpression([])
      ]
    );

    body.push(t.returnStatement(baseCreate));
  }

  buildMethods() {
    const classBodyPaths = this.path.get("body.body");
    const methods = [];

    for (const path of classBodyPaths) {
      const node = path.node;

      if (t.isClassMethod(node)) {
        methods.push(t.objectMethod("method", node.key, node.params, node.body));
      }
    }

    return t.objectExpression(methods);
  }
}