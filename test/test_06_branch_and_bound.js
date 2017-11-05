const assert = require('assert');

describe('chap.06 branch_and_bound', function() {
	describe('the_0_1_knapsack', function() {
		let { the_0_1_knapsack } = require('../branch_and_bound/the_0_1_knapsack');

		it('testcase 1', function() {
			let item_data = {
				item_values: [40, 30, 50, 10],
				item_weights: [2, 5, 10, 5],
			};
			let knapsack_capacity = 16;
			let expected_result = 90;

			let result = the_0_1_knapsack(item_data, knapsack_capacity);

			// console.log('max value:', result);

			assert.strictEqual(result, expected_result);
		});
		it('testcase 2', function() {
			let item_data = {
				item_values: [50, 60, 140],
				item_weights: [5, 10, 20],
			};
			let knapsack_capacity = 30;
			let expected_result = 200;

			let result = the_0_1_knapsack(item_data, knapsack_capacity);

			// console.log('max value:', result);

			assert.strictEqual(result, expected_result);
		});
	});
	describe('traveling_salesman', function() {
		let { traveling_salesman } = require('../branch_and_bound/traveling_salesman');

		it('testcase 1', function() {
			let adj_matrix = [
				[Infinity, 14, 4, 10, 20],
				[14, Infinity, 7, 8, 7],
				[4, 5, Infinity, 7, 16],
				[11, 7, 9, Infinity, 2],
				[18, 7, 17, 4, Infinity],
			];

			let expected_result = {
				min_distance: 30,
				shortest_path: [0, 3, 4, 1, 2],
			};

			let result = traveling_salesman(adj_matrix);

			// console.log('min distance:', result.min_distance);
			// console.log('path:', result.shortest_path);

			assert.strictEqual(result.min_distance, expected_result.min_distance);
			assert.deepStrictEqual(result.shortest_path, expected_result.shortest_path);
		});
		it('testcase 2', function() {
			let adj_matrix = [
				[Infinity, 3, 93, 13, 33, 9, 57],
				[4, Infinity, 77, 42, 21, 16, 34],
				[45, 17, Infinity, 36, 16, 28, 25],
				[39, 90, 80, Infinity, 56, 7, 91],
				[28, 46, 88, 33, Infinity, 25, 57],
				[3, 88, 18, 46, 92, Infinity, 7],
				[44, 26, 33, 27, 84, 39, Infinity],
			];

			let expected_result = {
				min_distance: 126,
				shortest_path: [0, 3, 5, 6, 2, 4, 1],
			};

			let result = traveling_salesman(adj_matrix);

			// console.log('min distance:', result.min_distance);
			// console.log('path:', result.shortest_path);

			assert.strictEqual(result.min_distance, expected_result.min_distance);
			assert.deepStrictEqual(result.shortest_path, expected_result.shortest_path);
		});
	});
});
