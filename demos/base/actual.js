'use strict';

YUI.add('actual', function (Y) {
	var HSVPalette = Y.HSVPalette;
	var Component = Y.Component;

	var _extends = Object.assign || function (target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];

			for (var key in source) {
				if (Object.prototype.hasOwnProperty.call(source, key)) {
					target[key] = source[key];
				}
			}
		}

		return target;
	};

	// import 'lodash';

	var Augmentation = function Augmentation() {};

	Augmentation.prototype = {
		test: function test() {
			console.log('called method from augmentation');
		}
	};
	var MyParentClass = function (_Component) {
		return Y.Base.create('MyParentClass', _Component, [Augmentation], {
			getObject: function getObject() {
				return {
					value: 'parent value'
				};
			},
			callSuperVoid: function callSuperVoid() {
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
			getObject: function getObject() {
				return _extends({}, MyClass.superclass.getObject.apply(this, []), {
					value: 'child value'
				});
			},
			renderUI: function renderUI() {
				console.log('static property', MyClass.STATIC_PROPERTY);

				new HSVPalette().render('body');

				console.log(this.getObject());
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
				MyClass.superclass.callSuperVoid.apply(this, [true, false]);

				console.log('gonna call method from augmentation:');
				this.test();
			}
		}, {
			STATIC_PROPERTY: { test: true },
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