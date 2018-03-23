'use strict';

YUI.add('actual', function (Y) {
	var HSVPalette = Y.HSVPalette;
	var Component = Y.Component;

	// import 'lodash';

	var A = 'sadas';

	var Augmentation = function Augmentation() {};Augmentation.prototype = {
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
				var div = MyClass.CARD;

				this.get('boundingBox').append(div);
				console.log('static property', MyClass.STATIC_PROPERTY);
				var pallete = new HSVPalette();

				this.get('boundingBox').append(function () {
					var _elem = document.createElement('div');

					_elem.setAttribute('class', 'thumbnail');

					_elem.setAttribute('style', 'width: 600px; margin: 20px auto;');

					_elem.appendChild(document.createTextNode('\n\t\t\t\t'));

					var _elem2 = document.createElement('div');

					_elem2.setAttribute('class', 'caption');

					_elem2.appendChild(document.createTextNode('\n\t\t\t\t\t'));

					var _elem3 = document.createElement('h3');

					_elem3.appendChild(document.createTextNode('Thumbnail label'));

					_elem2.appendChild(_elem3);

					_elem2.appendChild(document.createTextNode('\n\t\t\t\t\t'));

					var _elem4 = document.createElement('p');

					_elem4.appendChild(document.createTextNode('\n\t\t\t\t\t\t'));

					var _expr = pallete.render().get('boundingBox').getDOM(),
					    _res = _expr instanceof Node || _expr instanceof Array ? _expr : document.createTextNode(_expr);

					if (_res instanceof Array) {
						for (var _i3 = 0; _i3 < _res.length; _i3 += 1) {
							_elem4.appendChild(_res[_i3] instanceof Node || _res[_i3] instanceof Array ? _res[_i3] : document.createTextNode(_res[_i3]));
						}
					} else _elem4.appendChild(_res);

					_elem4.appendChild(document.createTextNode('\n\t\t\t\t\t'));

					_elem2.appendChild(_elem4);

					_elem2.appendChild(document.createTextNode('\n\t\t\t\t\t'));

					var _elem5 = document.createElement('p');

					_elem5.appendChild(document.createTextNode('\n\t\t\t\t\t\t'));

					var _elem6 = document.createElement('a');

					_elem6.setAttribute('href', '#');

					_elem6.setAttribute('class', 'btn btn-primary');

					_elem6.appendChild(document.createTextNode('\n\t\t\t\t\t\t\tAction\n\t\t\t\t\t\t'));

					_elem5.appendChild(_elem6);

					var _expr2 = ' ',
					    _res2 = _expr2 instanceof Node || _expr2 instanceof Array ? _expr2 : document.createTextNode(_expr2);

					if (_res2 instanceof Array) {
						for (var _i4 = 0; _i4 < _res2.length; _i4 += 1) {
							_elem5.appendChild(_res2[_i4] instanceof Node || _res2[_i4] instanceof Array ? _res2[_i4] : document.createTextNode(_res2[_i4]));
						}
					} else _elem5.appendChild(_res2);

					_elem5.appendChild(document.createTextNode('\n\t\t\t\t\t\t'));

					var _elem7 = document.createElement('a');

					_elem7.setAttribute('href', '#');

					_elem7.setAttribute('class', 'btn');

					_elem7.appendChild(document.createTextNode('\n\t\t\t\t\t\t\tAction\n\t\t\t\t\t\t'));

					_elem5.appendChild(_elem7);

					_elem5.appendChild(document.createTextNode('\n\t\t\t\t\t'));

					_elem2.appendChild(_elem5);

					_elem2.appendChild(document.createTextNode('\n\t\t\t\t'));

					_elem.appendChild(_elem2);

					_elem.appendChild(document.createTextNode('\n\t\t\t'));

					return _elem;
				}());
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