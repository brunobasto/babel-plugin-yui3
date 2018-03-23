import template from 'babel-template';
import * as types from 'babel-types';

const addTemplate = template(`
  YUI.add(MODULE_NAME_STRING, function(Y) {
  	IMPORTS

    MODULE_BODY

    CLASS_DECLARATIONS

    EXPORTS
  }, '', {
    'requires': MODULE_REQUIRES
  });
`);

export function add(imports, body, classDeclarations, exports, name, requires) {
	return addTemplate({
		CLASS_DECLARATIONS: classDeclarations,
		EXPORTS: exports,
		IMPORTS: imports,
		MODULE_BODY: body,
		MODULE_NAME_STRING: types.stringLiteral(name),
		MODULE_REQUIRES: types.arrayExpression(requires)
	});
}