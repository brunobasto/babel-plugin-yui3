'use strict';

YUI.add('actual', function (Y) {
  var MyClass = function (_Y$Base) {
    return Y.Base.create('MyClass', _Y$Base, [], {
      method: function method(param) {
        console.log('method', param);
      }
    }, {});
  }(Y.Base);

  Y.MyClass = MyClass;
}, '', {
  'requires': ['base']
});