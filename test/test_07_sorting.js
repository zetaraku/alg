const assert = require('assert');

// only numbers
describe('chap.07 sorting', function() {
	let n = 2000, range = 1000;
	let arr = [...Array(n)].map(() => Math.floor(range * Math.random()));

	let expected_result = arr.slice();
		expected_result.sort((a, b) => a - b);

	describe('insertion_sort', function() {
		let { insertion_sort } = require('../sorting/insertion_sort');

		it('should do insertion_sort (stable)', function() {
			let result = arr.slice();
				insertion_sort(result);

			assert.deepStrictEqual(result, expected_result);
		});
	});
	describe('selection_sort', function() {
		let { selection_sort } = require('../sorting/selection_sort');

		it('should do selection_sort (stable)', function() {
			let result = arr.slice();
				selection_sort(result);

			assert.deepStrictEqual(result, expected_result);
		});
	});
	describe('exchange_sort', function() {
		let { exchange_sort } = require('../sorting/exchange_sort');

		it('should do exchange_sort (unstable)', function() {
			let result = arr.slice();
				exchange_sort(result);

			assert.deepStrictEqual(result, expected_result);
		});
	});
	describe('merge_sort', function() {
		let {
			merge_sort_iterative,
			merge_sort_modifylink,
		} = require('../sorting/merge_sort');

		it('should do merge_sort_iterative (stable)', function() {
			let result = arr.slice();
				merge_sort_iterative(result);

			assert.deepStrictEqual(result, expected_result);
		});
		it('should do merge_sort_modifylink (stable)', function() {
			let result = arr.slice();
				merge_sort_modifylink(result);

			assert.deepStrictEqual(result, expected_result);
		});
	});
	describe('heap_sort', function() {
		let { heap_sort } = require('../sorting/heap_sort');

		it('should do heap_sort (unstable)', function() {
			let result = arr.slice();
				heap_sort(result);

			assert.deepStrictEqual(result, expected_result);
		});
	});
});
