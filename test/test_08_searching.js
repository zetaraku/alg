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
	describe('b_tree', function() {
		let { BTree, BTreeNode } = require('../searching/b_tree');
		BTree.factor = 3;

		describe('BTree', function() {
			let keyList = ['F', 'S', 'Q', 'K', 'C', 'L', 'H', 'T', 'V', 'W', 'M', 'R', 'N', 'P', 'A', 'B', 'X', 'Y', 'D', 'Z', 'E'];
			let notKeyList = ['G', 'I', 'J', 'O', 'U'];

			let btree = new BTree();

			it('new', function() {
				let expectedInitialized = BTree.from({
					keys: [],
					children: null
				});
				assert.deepStrictEqual(btree,expectedInitialized);
			});
			it('insert', function() {
				let expectedInserted = BTree.from({
					keys: ['N'],
					children: [
						{
							keys: ['C', 'K'],
							children: [
								{
									keys: ['A', 'B'],
									children: null
								},
								{
									keys: ['D', 'E', 'F', 'H'],
									children: null
								},
								{
									keys: ['L', 'M'],
									children: null
								}
							]
						},
						{
							keys: ['S', 'W'],
							children: [
								{
									keys: ['P', 'Q', 'R'],
									children: null
								},
								{
									keys: ['T', 'V'],
									children: null
								},
								{
									keys: ['X', 'Y', 'Z'],
									children: null
								}
							]
						}
					]
				});
				for(let key of keyList) {
					btree.insert(key);
				}
				assert.deepStrictEqual(btree, expectedInserted);
			});
			it('search', function() {
				for(let key of notKeyList) {
					assert(btree.search(key) === null);
				}
				for(let key of keyList) {
					assert(btree.search(key) !== null);
				}
			});
			it('delete', function() {
				let expectedDeleted = BTree.from({
					keys: [],
					children: null
				});
				for(let key of notKeyList) {
					assert(btree.delete(key) === false);
				}
				for(let key of keyList) {
					assert(btree.delete(key) === true);
				}
				for(let key of notKeyList) {
					assert(btree.delete(key) === false);
				}
				assert.deepStrictEqual(btree, expectedDeleted);
			});
		});

		describe('BTreeNode', function() {
			// insert preparation

			it.skip('correct', function() {
				// insert test check
			});
		});
	});
});
