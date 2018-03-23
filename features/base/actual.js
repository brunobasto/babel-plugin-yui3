'use strict';

import {Base, Event} from '@yui/base';
import '@yui/test';
// import 'lodash';

console.log(Event);

const Augmentation = function() {};

Augmentation.prototype = {
	test() {
		console.log('called method from augmentation');
	}
};

class MyParentClass extends Base {
	static AUGMENTS = [Augmentation];

	static ATTRS = {
		parentAttribute: {
			value: 'parent'
		}
	};

	superMethod() {
		console.log('called method from super class!');

		console.log('gonna get attribute from super class:');
		console.log(
			'got attribute from super class',
			this.get('parentAttribute')
		);
	}
}

class MyClass extends MyParentClass {
	static ATTRS = {
		childAttribute: {
			value: 'child'
		}
	};

	method() {
		const arrowFunction = () => {
			console.log('called arrow function!');

			console.log('gonna get attribute from arrow function:');
			console.log('got attribute', this.get('childAttribute'));
		};

		console.log('gonna call arrow function');
		arrowFunction();

		console.log('gonna call method from super class:');
		super.superMethod(true, false);

		console.log('gonna call method from augmentation:');
		this.test();
	}
}

export default MyClass;
export {MyParentClass, MyClass};