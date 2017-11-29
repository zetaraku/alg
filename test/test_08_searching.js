const assert = require('assert');
const { shuffleArray } = require('../util/utils');

describe('chap.08 searching', function() {
	describe('selection', function() {
		let { selection, find_median } = require('../searching/selection');

		let n = 1000;
		let compareFunction = (a, b) => (a - b);
		let data = [...Array(n)].map((_, i) => i);
		shuffleArray(data);

		let sorted_data = data.slice().sort(compareFunction);

		it('should do selection', function() {
			let k = Math.floor(Math.random() * n);
			let result = selection(data, k, compareFunction);
			assert.strictEqual(result, sorted_data[k]);
		});
		it('should do find_median', function() {
			let result = find_median(data, compareFunction);
			assert.strictEqual(result, sorted_data[Math.floor((n-1)/2)]);
		});
	});
});
