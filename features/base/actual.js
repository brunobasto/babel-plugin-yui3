'use strict';

import 'base';
import 'test';

class MyParentClass {
	static ATTRS = {
		parentAttribute: {
			value: 'parent'
		}
	};

	superMethod() {
		console.log('got parentAttribute', this.get('parentAttribute'));
	}
}

class MyClass extends MyParentClass {
	static ATTRS = {
		childAttribute: {
			value: 'child'
		}
	};

	method(param) {
		const arrowFunction = () => {
			console.log('got childAttribute', this.get('childAttribute'));
		};
		arrowFunction();
		super.superMethod(true, false);
		console.log('called method with param:', param);
	}
}

export default MyClass;
export {MyParentClass, MyClass};

