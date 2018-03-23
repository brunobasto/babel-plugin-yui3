'use strict';

var Augmentation = function Augmentation() {};

Augmentation.prototype = {
	test: function test() {
		console.log('called method from augmentation');
	}
};

YUI.add('actual', function (Y) {
	var MyParentClass = MyParentClass = function () {
		return Y.Base.create('MyParentClass', Y.Base, [Augmentation], {
			superMethod: function superMethod() {
				console.log('called method from super class!');

				console.log('gonna get attribute from super class:');
				console.log('got attribute from super class', this.get('parentAttribute'));
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
					console.log('called arrow function!');

					console.log('gonna get attribute from arrow function:');
					console.log('got attribute', _this.get('childAttribute'));
				};

				console.log('gonna call arrow function');
				arrowFunction();

				console.log('gonna call method from super class:');
				MyClass.superclass.superMethod.apply(this, [true, false]);

				console.log('gonna call method from augmentation:');
				this.test();
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