import template from 'babel-template';
import * as types from 'babel-types';

const postTemplate = template(`
YUI.add(MODULE_NAME, function(Y) {
  	IMPORTS
  	BODY
	EXPORTS
  }, '', {
    'requires': REQUIRES
  });
`);

export function addPost(moduleName, imports, body, exports, requires) {
	return postTemplate({
		BODY: body,
		EXPORTS: exports,
		IMPORTS: imports,
		MODULE_NAME: types.stringLiteral(moduleName),
		REQUIRES: types.arrayExpression(requires)
	});
}