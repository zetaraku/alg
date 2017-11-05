const assert = require('assert');

describe('chap.02 divide_and_conquer', function() {
	describe('mergesort', function() {
		let { mergesort } = require('../divide_and_conquer/mergesort');

		let n = 20, range = 100;
		let arr = [...Array(n)].map(() => Math.floor(range * Math.random()));

		let expected_result = arr.slice();
			expected_result.sort((a, b) => a - b);

		it('should do a stable sort', function() {
			let result = arr.slice();
				mergesort(result, (a, b) => a - b);

			// console.log('before sort:', arr);
			// console.log('after sort:', result);
			// console.log('expected result:', expected_result);

			assert.deepStrictEqual(result, expected_result);
		});
	});
	describe('quicksort', function() {
		let { quicksort } = require('../divide_and_conquer/quicksort');

		let n = 20, range = 100;
		let arr = [...Array(n)].map(() => Math.floor(range * Math.random()));

		let expected_result = arr.slice();
			expected_result.sort((a, b) => a - b);

		it('should do a stable sort', function() {
			let result = arr.slice();
				quicksort(result, (a, b) => a - b);

			// console.log('before sort:', arr);
			// console.log('after sort:', result);
			// console.log('expected result:', expected_result);

			assert.deepStrictEqual(result, expected_result);
		});
	});
});
