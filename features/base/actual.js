'use strict';

import '@yui/test';
import {HSVPalette} from '@yui/aui-color-picker-base';
import {Component} from '@yui/aui-component';
// import 'lodash';

const A = 'sadas';

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
	static STATIC_PROPERTY = {test: true};

	static ATTRS = {
		childAttribute: {
			value: 'child'
		}
	};

	renderUI() {
		const div = MyClass.CARD;

		this.get('boundingBox').append(div);
		console.log('static property', MyClass.STATIC_PROPERTY);
		const pallete = new HSVPalette();

		this.get('boundingBox').append(
			<div class="thumbnail" style="width: 600px; margin: 20px auto;">
				<div class="caption">
					<h3>Thumbnail label</h3>
					<p>
						{pallete
							.render()
							.get('boundingBox')
							.getDOM()}
					</p>
					<p>
						<a href="#" class="btn btn-primary">
							Action
						</a>{' '}
						<a href="#" class="btn">
							Action
						</a>
					</p>
				</div>
			</div>
		);
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
		super.superMethod(true, false);

		console.log('gonna call method from augmentation:');
		this.test();
	}
}

export default MyClass;
export {MyParentClass, MyClass};