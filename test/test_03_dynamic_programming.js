const assert = require('assert');

describe('chap.03 dynamic_programming', function() {
	describe('binomial_coefficient', function() {
		let { binomial_coef } = require('../dynamic_programming/binomial_coefficient');

		it('computed correct result', function() {
			assert.strictEqual(binomial_coef(0, 0), 1);
			assert.strictEqual(binomial_coef(10, 0), 1);
			assert.strictEqual(binomial_coef(10, 10), 1);
			assert.strictEqual(binomial_coef(25, 17), 1081575);
		});
	});
	describe('floyd_warshall_alg', function() {
		let {
			floyd_warshall_alg_1,
			floyd_warshall_alg_2,
			floyd_warshall_alg_3,
		} = require('../dynamic_programming/floyd_warshall_alg');

		let adj_matrix = [
			[0, 1, Infinity, 1, 5],
			[9, 0, 3, 2, Infinity],
			[Infinity, Infinity, 0, 4, Infinity],
			[Infinity, Infinity, 2, 0, 3],
			[3, Infinity, Infinity, Infinity, 0],
		];

		let expected_result = [
			[0, 1, 3, 1, 4],
			[8, 0, 3, 2, 5],
			[10, 11, 0, 4, 7],
			[6, 7, 2, 0, 3],
			[3, 4, 6, 4, 0],
		];

		it('alg 1 correct', function() {
			let result = floyd_warshall_alg_1(adj_matrix);
			assert.deepStrictEqual(result, expected_result);
		});
		it('alg 2 correct', function() {
			let result = floyd_warshall_alg_2(adj_matrix);
			assert.deepStrictEqual(result, expected_result);
		});
		it('alg 3 correct', function() {
			let result = floyd_warshall_alg_3(adj_matrix);

			// let n = adj_matrix.length;
			// for(let i = 0; i < n; i++)
			// 	for(let j = 0; j < n; j++)
			// 		console.log(
			// 			`[${i}, ${j}] ` +
			// 			reconstructPath(i, j, result.nextnode_matrix).join(' -> ') +
			// 			` (${result.distance_matrix[i][j]})`
			// 		);

			assert.deepStrictEqual(result.distance_matrix, expected_result);
		});
	});
	describe('consecutive_matrix_multiplication', function() {
		let {
			consecutive_matrix_multiplication,
			reconstructOrder,
		} = require('../dynamic_programming/consecutive_matrix_multiplication');

		let matrix_sizes = [5, 2, 3, 4, 6, 7, 8];
		let n = matrix_sizes.length - 1;

		let expected_result = {
			cost_matrix: [
				[0, 30, 64, 132, 226, 348],
				[undefined, 0, 24, 72, 156, 268],
				[undefined, undefined, 0, 72, 198, 366],
				[undefined, undefined, undefined, 0, 168, 392],
				[undefined, undefined, undefined, undefined, 0, 336],
				[undefined, undefined, undefined, undefined, undefined, 0],
			],
			firsttail_matrix: [
				[undefined, 0, 0, 0, 0, 0],
				[undefined, undefined, 1, 2, 3, 4],
				[undefined, undefined, undefined, 2, 3, 4],
				[undefined, undefined, undefined, undefined, 3, 4],
				[undefined, undefined, undefined, undefined, undefined, 4],
				[undefined, undefined, undefined, undefined, undefined, undefined],
			],
			order: [0, [[[[1, 2], 3], 4], 5]],
		};

		it('correct', function() {
			let result = consecutive_matrix_multiplication(matrix_sizes);
			let order = reconstructOrder(0, n-1, result.firsttail_matrix);

			// console.log('min cost:', result.cost_matrix[0][n-1]);
			// console.log('order:', JSON.stringify(order));

			assert.deepStrictEqual(result.cost_matrix, expected_result.cost_matrix);
			assert.deepStrictEqual(result.firsttail_matrix, expected_result.firsttail_matrix);
			assert.deepStrictEqual(order, expected_result.order);
		});
	});
	describe('optimal_bst', function() {
		let { optimal_bst, reconstructTree } = require('../dynamic_programming/optimal_bst');

		let access_prob = [3, 3, 1, 1];
		let n = access_prob.length;

		// assume the data sum to 100% probability
		let total_base = access_prob.reduce((a, b) => a + b, 0);
		// or set the base manually
		// let total_base = 1;

		let expected_result = {
			cost_matrix: [
				[0, 3, 9, 11, 14],
				[undefined, 0, 3, 5, 8],
				[undefined, undefined, 0, 1, 3],
				[undefined, undefined, undefined, 0, 1],
				[undefined, undefined, undefined, undefined, 0],
			],
			rootnode_matrix: [
				[undefined, 0, 0, 1, 1],
				[undefined, undefined, 1, 1, 1],
				[undefined, undefined, undefined, 2, 2],
				[undefined, undefined, undefined, undefined, 3],
				[undefined, undefined, undefined, undefined, undefined],
			],
			tree: {
				key: 1,
				left: {
					key: 0,
					left: null,
					right: null,
				},
				right: {
					key: 2,
					left: null,
					right: {
						key: 3,
						left: null,
						right: null,
					},
				},
			},
		};

		it('correct', function() {
			let result = optimal_bst(access_prob);
			let tree = reconstructTree(0, n, result.rootnode_matrix);

			// console.log('min cost:', result.cost_matrix[0][n] / total_base);
			// console.log('tree:', JSON.stringify(tree));

			assert.deepStrictEqual(result.cost_matrix, expected_result.cost_matrix);
			assert.deepStrictEqual(result.rootnode_matrix, expected_result.rootnode_matrix);
			assert.deepStrictEqual(tree, expected_result.tree);
		});
	});
	describe('traveling_salesman', function() {
		let {
			traveling_salesman_1,
			traveling_salesman_2,
		} = require('../dynamic_programming/traveling_salesman');

		let adj_matrix = [
			[0, 2, 9, Infinity],
			[1, 0, 6, 4],
			[Infinity, 7, 0, 8],
			[6, 3, Infinity, 0],
		];

		let n = adj_matrix.length;

		let expected_result = {
			min_distance: 21,
			shortest_path: [0, 2, 3, 1],
		};

		it('alg 1 correct', function() {
			let result = traveling_salesman_1(adj_matrix);

			// console.log('min distance:', result.min_distance);
			// console.log('path:', result.shortest_path);

			assert.strictEqual(result.min_distance, expected_result.min_distance);
			assert.deepStrictEqual(result.shortest_path, expected_result.shortest_path);
		});
		it('alg 2 correct', function() {
			let result = traveling_salesman_2(adj_matrix);

			// console.log('min distance:', result.min_distance);
			// console.log('path:', result.shortest_path);

			assert.strictEqual(result.min_distance, expected_result.min_distance);
			assert.deepStrictEqual(result.shortest_path, expected_result.shortest_path);
		});
	});
	describe('sequence_alignment', function() {
		let { sequence_alignment, reconstructPath } = require('../dynamic_programming/sequence_alignment');

		let s1 = 'AACAGTTACC', s2 = 'TAAGGTCA';
		let m = s1.length, n = s2.length;

		let expected_result = {
			min_cost: 7,
		};

		it('correct', function() {
			let result = sequence_alignment(s1, s2, { unmatch_penalty: 1, gap_penalty: 2 });

			let min_cost = result.cost_matrix[m][n];

			// console.log('min cost:', min_cost);

			let alignment = reconstructPath(s1, s2, result.choose_matrix);

			// console.log('alignment:');
			// console.log('\t', alignment.s1);
			// console.log('\t', alignment.s2);

			assert.strictEqual(min_cost, expected_result.min_cost);
		});
	});
	describe('the_0_1_knapsack', function() {
		let {
			the_0_1_knapsack_bottom_up,
			the_0_1_knapsack_bidirectional,
		} = require('../dynamic_programming/the_0_1_knapsack');

		let item_data = {
			item_values: [50, 60, 140],
			item_weights: [5, 10, 20],
		};
		let knapsack_capacity = 30;

		let expected_result = 200;

		it('alg 1 (bottom_up) correct', function() {
			let result = the_0_1_knapsack_bottom_up(item_data, knapsack_capacity);

			// console.log('max value:', result);

			assert.strictEqual(result, expected_result);
		});
		it('alg 2 (bidirectional) correct', function() {
			let result = the_0_1_knapsack_bidirectional(item_data, knapsack_capacity);

			// console.log('max value:', result);

			assert.strictEqual(result, expected_result);
		});
	});
});
