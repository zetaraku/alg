const assert = require('assert');

class SortTester {
	constructor(testsets, { compareFunction = (a, b) => (a - b) } = {}) {
		this.datasets = testsets.map((t) => {
			let data = [...Array(t.n)].map((_, i) => t.dataGenerator(i));
			return {
				data: data,
				expected_result: data.slice().sort(compareFunction)
			};
		});
		this.compareFunction = compareFunction;
	}

	test(sortFunctionToBeTested) {
		for(let dataset of this.datasets) {
			let result = dataset.data.slice();
			sortFunctionToBeTested(result, this.compareFunction);
			assert.deepStrictEqual(result, dataset.expected_result);
		}
	}

	test_no_compare(sortFunctionToBeTested) {
		for(let dataset of this.datasets) {
			let result = dataset.data.slice();
			sortFunctionToBeTested(result, (e) => e);
			assert.deepStrictEqual(result, dataset.expected_result);
		}
	}
}

class StableSortTester {
	constructor(testsets, { compareFunction = (a, b) => (a - b) } = {}) {
		let keyAndOrderCompareFunction = (a, b) => compareFunction(a.key, b.key) || a.order - b.order;
		this.datasets = testsets.map((t) => {
			let data = [...Array(t.n)].map((_, i) => ({ key: t.dataGenerator(i), order: i }));
			return {
				data: data,
				expected_result: data.slice().sort(keyAndOrderCompareFunction)
			};
		});
		this.keyCompareFunction = (a, b) => compareFunction(a.key, b.key);
	}

	test(sortFunctionToBeTested) {
		for(let dataset of this.datasets) {
			let result = dataset.data.slice();
			sortFunctionToBeTested(result, this.keyCompareFunction);
			assert.deepStrictEqual(result, dataset.expected_result);
		}
	}

	test_no_compare(sortFunctionToBeTested) {
		for(let dataset of this.datasets) {
			let result = dataset.data.slice();
			sortFunctionToBeTested(result, (e) => e.key);
			assert.deepStrictEqual(result, dataset.expected_result);
		}
	}
}

describe('chap.07 sorting', function() {
	let testsets = [
		{ n: 0, dataGenerator: (i) => null },
		{ n: 1, dataGenerator: (i) => 0 },
		{ n: 2, dataGenerator: (i) => i },
		{ n: 1000, dataGenerator: (i) => 500 },
		{ n: 1000, dataGenerator: (i) => +i },
		{ n: 1000, dataGenerator: (i) => -i },
		{ n: 1000, dataGenerator: (i) => Math.floor(-250 + 500 * Math.random()) },
	];

	let sort_tester = new SortTester(testsets);
	let stable_sort_tester = new StableSortTester(testsets);

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
