'use strict';

YUI.add('actual', function (Y) {
	var HSVPalette = Y.HSVPalette;
	var Component = Y.Component;

	// import 'lodash';

	var Augmentation = function Augmentation() {};

	Augmentation.prototype = {
		test: function test() {
			console.log('called method from augmentation');
		}
	};
	var MyParentClass = function (_Component) {
		return Y.Base.create('MyParentClass', _Component, [Augmentation], {
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
	}(Component);

	var MyClass = function (_MyParentClass) {
		return Y.Base.create('MyClass', _MyParentClass, [], {
			renderUI: function renderUI() {
				new HSVPalette().render('body');
			},
			method: function method() {
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
	'requires': ['test', 'aui-color-picker-base', 'aui-component']
});