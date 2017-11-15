const assert = require('assert');

class SortTester {
	constructor({ n = 1000, range = 500, dataGenerator = () => Math.floor(range * Math.random()) }) {
		this.data = [...Array(n)].map((_, i) => dataGenerator(i));
		this.compareFunction = (a, b) => (a - b);
		this.expected_result = this.data.slice();
		this.expected_result.sort((a, b) => (a - b));
	}

	test(sortFunction) {
		let result = this.data.slice();
		sortFunction(result, this.compareFunction);
		assert.deepStrictEqual(result, this.expected_result);
	}
}

class StableSortTester {
	constructor({ n = 1000, range = 500, dataGenerator = () => Math.floor(range * Math.random()) }) {
		this.data = [...Array(n)].map((_, i) => ({ key: dataGenerator(i), order: i }));
		this.compareFunction = (a, b) => (a.key - b.key);
		this.expected_result = this.data.slice();
		this.expected_result.sort((a, b) => (a.key - b.key || a.order - b.order));
	}

	test(sortFunction) {
		let result = this.data.slice();
		sortFunction(result, this.compareFunction);
		assert.deepStrictEqual(result, this.expected_result);
	}
}

describe('chap.07 sorting', function() {
	let sort_tester = new SortTester({});
	let stable_sort_tester = new StableSortTester({});

	describe('insertion_sort', function() {
		let { insertion_sort } = require('../sorting/insertion_sort');

		it('should do insertion_sort (stable)', function() {
			stable_sort_tester.test(insertion_sort);
		});
	});
	describe('selection_sort', function() {
		let { selection_sort } = require('../sorting/selection_sort');

		it('should do selection_sort (unstable)', function() {
			sort_tester.test(selection_sort);
		});
	});
	describe('exchange_sort', function() {
		let { exchange_sort } = require('../sorting/exchange_sort');

		it('should do exchange_sort (unstable)', function() {
			sort_tester.test(exchange_sort);
		});
	});
	describe('merge_sort', function() {
		let {
			merge_sort,
			merge_sort_iterative,
			merge_sort_modifylink,
		} = require('../sorting/merge_sort');

		it('should do merge_sort (stable)', function() {
			stable_sort_tester.test(merge_sort);
		});
		it('should do merge_sort_iterative (stable)', function() {
			stable_sort_tester.test(merge_sort_iterative);
		});
		it('should do merge_sort_modifylink (stable)', function() {
			stable_sort_tester.test(merge_sort_modifylink);
		});
	});
	describe('quick_sort', function() {
		let {
			quick_sort,
			quick_sort_stable,
			quick_sort_bidirectional,
		} = require('../sorting/quick_sort');

		it('should do quick_sort (unstable)', function() {
			sort_tester.test(quick_sort);
		});
		it('should do quick_sort_stable (stable)', function() {
			stable_sort_tester.test(quick_sort_stable);
		});
		it('should do quick_sort_bidirectional (unstable)', function() {
			sort_tester.test(quick_sort_bidirectional);
		});
	});
	describe('heap_sort', function() {
		let { heap_sort } = require('../sorting/heap_sort');

		it('should do heap_sort (unstable)', function() {
			sort_tester.test(heap_sort);
		});
	});
});
