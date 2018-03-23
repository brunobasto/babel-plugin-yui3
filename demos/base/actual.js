'use strict';

YUI.add('actual', function (Y) {
	var MyParentClass = MyParentClass = function () {
		return Y.Base.create('MyParentClass', Y.Base, [], {
			superMethod: function superMethod() {
				console.log('got parentAttribute', this.get('parentAttribute'));
			}
		}, {
			ATTRS: {
				parentAttribute: {
					value: 'parent'
				}
			}
		});
	}();

	var MyClass = MyClass = function (_MyParentClass) {
		return Y.Base.create('MyClass', _MyParentClass, [], {
			method: function method(param) {
				var _this = this;

				var arrowFunction = function arrowFunction() {
					console.log('got childAttribute', _this.get('childAttribute'));
				};
				arrowFunction();
				MyClass.superclass.superMethod.apply(this, [true, false]);
				console.log('called method with param:', param);
			}
		}, {
			ATTRS: {
				childAttribute: {
					value: 'child'
				}
			}
		});
	}(MyParentClass);

	Y.MyClass = MyClass
	Y.MyParentClass = MyParentClass
	Y.MyClass = MyClass
}, '', {
	'requires': ['base', 'test']
});