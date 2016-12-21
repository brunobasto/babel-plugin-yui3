import template from 'babel-template';
import * as types from 'babel-types';

let addTemplate = template(`
  YUI.add(MODULE_NAME_STRING, function(Y) {
    MODULE_BODY

    EXPOSED
  }, '', {
    'requires': MODULE_REQUIRES
  });
`);

export function add(body, exposed, name, requires) {
  return addTemplate({
    EXPOSED: exposed,
    MODULE_BODY: body,
    MODULE_NAME_STRING: types.stringLiteral(name),
    MODULE_REQUIRES: types.arrayExpression(requires)
  });
};