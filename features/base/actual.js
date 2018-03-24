'use strict';

import '@yui/test';
import {HSVPalette} from '@yui/aui-color-picker-base';
import {Component} from '@yui/aui-component';
// import 'lodash';

const Augmentation = function() {};

Augmentation.prototype = {
	test() {
		console.log('called method from augmentation');
	}
};

class MyParentClass extends Component {
	static AUGMENTS = [Augmentation];

	static ATTRS = {
		parentAttribute: {
			value: 'parent'
		}
	};

	getObject() {
		return {
			value: 'parent value'
		};
	}

	callSuperVoid() {
		console.log('called method from super class!');

		console.log('gonna get attribute from super class:');
		console.log(
			'got attribute from super class',
			this.get('parentAttribute')
		);
	}
}

class MyClass extends MyParentClass {
	static STATIC_PROPERTY = {test: true};

	static ATTRS = {
		childAttribute: {
			value: 'child'
		}
	};

	getObject() {
		return {
			...super.getObject(),
			value: 'child value'
		};
	}

	renderUI() {
		console.log('static property', MyClass.STATIC_PROPERTY);

		new HSVPalette().render('body');

		console.log(this.getObject());
	}

	method() {
		const arrowFunction = () => {
			console.log('called arrow function!');

			console.log('gonna get attribute from arrow function:');
			console.log('got attribute', this.get('childAttribute'));
		};

		console.log('gonna call arrow function');
		arrowFunction();

		console.log('gonna call method from super class:');
		super.callSuperVoid(true, false);

		console.log('gonna call method from augmentation:');
		this.test();
	}
}

export default MyClass;
export {MyParentClass, MyClass};