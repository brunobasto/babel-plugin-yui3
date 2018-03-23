import template from 'babel-template';
import * as types from 'babel-types';

const addTemplate = template(`
  YUI.add(MODULE_NAME_STRING, function(Y) {
    MODULE_BODY

    EXPORTS
  }, '', {
    'requires': MODULE_REQUIRES
  });
`);

export function add(body, exports, name, requires) {
	return addTemplate({
		EXPORTS: exports,
		MODULE_BODY: body,
		MODULE_NAME_STRING: types.stringLiteral(name),
		MODULE_REQUIRES: types.arrayExpression(requires)
	});
}