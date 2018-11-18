const assert = require('assert');

describe('chap.05 backtracking', function() {
	describe('n_queens', function() {
		let {
			n_queens,
			n_queens_1976,
		} = require('../backtracking/n_queens');

		it('alg 1 correct', function() {
			assert.strictEqual(n_queens(5).length, 10);
			assert.strictEqual(n_queens(7).length, 40);
		});
		it('alg 1976 correct', function() {
			assert.strictEqual(n_queens_1976(6).length, 4);
			assert.strictEqual(n_queens_1976(8).length, 92);
		});
		it('alg 1 & alg 1976 yield the same result', function() {
			assert.deepStrictEqual(n_queens(7), n_queens_1976(7));
		});
	});
	describe('monte_carlo_alg', function() {
		let { monte_carlo_alg, n_queens_1976_estimated } = require('../backtracking/monte_carlo_alg');

		it('! please check manually', function() {
			let N = 20;
			let n = 8;
			let estimated_nodes = 0;
			for(let i = 0; i < N; i++) {
				estimated_nodes += n_queens_1976_estimated(n);
			}

			// console.log(estimated_nodes / N);	// ~16450, actual: 17694
		});
	});
	describe('sum_of_subsets', function() {
		let { sum_of_subsets } = require('../backtracking/sum_of_subsets');

		it('testcase 1', function() {
			let item_weights = [5, 6, 10, 11, 16];
			let total_capacity = 21;
			let expected_results = [
				new Set([0, 1, 2]),
				new Set([0, 4]),
				new Set([2, 3]),
			];

			let results = sum_of_subsets(item_weights, total_capacity);

			assert.deepStrictEqual(results.length, expected_results.length);
		});
		it('testcase 2', function() {
			let item_weights = [1, 3, 3, 3, 6];
			let total_capacity = 9;
			let expected_results = [
				new Set([1, 2, 3]),
				new Set([1, 4]),
				new Set([2, 4]),
				new Set([3, 4]),
			];

			let results = sum_of_subsets(item_weights, total_capacity);

			assert.deepStrictEqual(results.length, expected_results.length);
		});
		it('testcase 3', function() {
			let item_weights = [2, 4, 6];
			let total_capacity = 5;
			let expected_results = [
			];

			let results = sum_of_subsets(item_weights, total_capacity);

			assert.deepStrictEqual(results.length, expected_results.length);
		});
		it('testcase 4', function() {
			let item_weights = [1, 2, 3];
			let total_capacity = 0;
			let expected_results = [
				new Set([]),
			];

			let results = sum_of_subsets(item_weights, total_capacity);

			assert.deepStrictEqual(results.length, expected_results.length);
		});
	});
	describe('graph_coloring', function() {
		let { graph_coloring } = require('../backtracking/graph_coloring');

		let adj_matrix = [
			[false, true, true, true],
			[true, false, true, false],
			[true, true, false, true],
			[true, false, true, false],
		];
		let number_of_colors = 3;

		let expected_results = [
			[0, 1, 2, 1],
			[0, 2, 1, 2],
			[1, 0, 2, 0],
			[1, 2, 0, 2],
			[2, 0, 1, 0],
			[2, 1, 0, 1],
		];

		it('correct', function() {
			let results = graph_coloring(adj_matrix, number_of_colors);

			// console.log(results);

			assert.deepStrictEqual(results, expected_results);
		});
	});
	describe('hamiltonian_circuit', function() {
		let { hamiltonian_circuit } = require('../backtracking/hamiltonian_circuit');

		let adj_matrix = [
			[false, true, true, false, false, false, true, true, false],
			[true, false, true, false, false, false, true, true, false],
			[true, true, false, true, false, true, false, false, false],
			[false, false, true, false, true, false, false, false, false],
			[false, false, false, true, false, true, false, false, false],
			[false, false, true, false, true, false, true, false, false],
			[true, true, false, false, false, true, false, true, false],
			[true, true, false, false, false, false, true, false, false],
		];

		let expected_results = [
			[0, 1, 2, 3, 4, 5, 6, 7],
			[0, 1, 7, 6, 5, 4, 3, 2],
			[0, 2, 3, 4, 5, 6, 1, 7],
			[0, 2, 3, 4, 5, 6, 7, 1],
			[0, 6, 5, 4, 3, 2, 1, 7],
			[0, 7, 1, 2, 3, 4, 5, 6],
			[0, 7, 1, 6, 5, 4, 3, 2],
			[0, 7, 6, 5, 4, 3, 2, 1],
		];

		it('correct', function() {
			let results = hamiltonian_circuit(adj_matrix);

			// console.log(results);

			assert.deepStrictEqual(results, expected_results);
		});
	});
	describe('the_0_1_knapsack', function() {
		let { the_0_1_knapsack } = require('../backtracking/the_0_1_knapsack');

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
});
