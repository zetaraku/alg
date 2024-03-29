const assert = require('assert');
const I = Infinity;
const U = undefined;

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
			reconstructPath,
			NegativeCycleDetectedException,
		} = require('../dynamic_programming/floyd_warshall_alg');

		describe('without negative cycle', function() {
			let adj_matrix = [
				[0, 1, I, 1, 5],
				[9, 0, 3, 2, I],
				[I, I, 0, 4, I],
				[I, I, 2, 0, 3],
				[3, I, I, I, 0],
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

				let expected_paths = [
					[
						[0],
						[0, 1],
						[0, 3, 2],
						[0, 3],
						[0, 3, 4],
					],
					[
						[1, 3, 4, 0],
						[1],
						[1, 2],
						[1, 3],
						[1, 3, 4],
					],
					[
						[2, 3, 4, 0],
						[2, 3, 4, 0, 1],
						[2],
						[2, 3],
						[2, 3, 4],
					],
					[
						[3, 4, 0],
						[3, 4, 0, 1],
						[3, 2],
						[3],
						[3, 4],
					],
					[
						[4, 0],
						[4, 0, 1],
						[4, 0, 3, 2],
						[4, 0, 3],
						[4],
					],
				];

				let n = adj_matrix.length;
				let result_paths = [...Array(n)].map((_, i) =>
					[...Array(n)].map((_, j) =>
						reconstructPath(i, j, result.nextnode_matrix)
					)
				);

				assert.deepStrictEqual(result.distance_matrix, expected_result);
				assert.deepStrictEqual(result_paths, expected_paths);
			});
		});
		describe('with negative cycle', function() {
			let adj_matrix = [
				[ I, 2, 1, I, I ],
				[ -2, I, I, 1, I ],
				[ I, I, I, 1, I ],
				[ -10, -1, I, I, I ],
				[ I, I, I, -1, I ],
			];

			it('alg 1 detected negative cycle', function() {
				assert.throws(() => floyd_warshall_alg_1(adj_matrix), NegativeCycleDetectedException);
			});
			it('alg 2 detected negative cycle', function() {
				assert.throws(() => floyd_warshall_alg_2(adj_matrix), NegativeCycleDetectedException);
			});
			it('alg 3 detected negative cycle', function() {
				assert.throws(() => floyd_warshall_alg_3(adj_matrix), NegativeCycleDetectedException);
			});
		});
	});
	describe('bellman_ford_alg', function() {
		let {
			bellman_ford_alg_1,
			NegativeCycleDetectedException,
		} = require('../dynamic_programming/bellman_ford_alg');

		describe('without negative cycle', function() {
			let adj_matrix = [
				[0, 1, I, 1, 5],
				[9, 0, 3, 2, I],
				[I, I, 0, 4, I],
				[I, I, 2, 0, 3],
				[3, I, I, I, 0],
			];

			let expected_result = [
				[0, 1, 3, 1, 4],
				[8, 0, 3, 2, 5],
				[10, 11, 0, 4, 7],
				[6, 7, 2, 0, 3],
				[3, 4, 6, 4, 0],
			];

			it('alg 1 correct', function() {
				for (let i = 0; i < adj_matrix.length; i++) {
					let result = bellman_ford_alg_1(adj_matrix, i);
					assert.deepStrictEqual(result, expected_result[i]);
				}
			});
		});
		describe('with negative cycle', function() {
			let adj_matrix = [
				[ I, 2, 1, I, I ],
				[ -2, I, I, 1, I ],
				[ I, I, I, 1, I ],
				[ -10, -1, I, I, I ],
				[ I, I, I, -1, I ],
			];

			it('alg 1 detected negative cycle', function() {
				for (let i = 0; i < adj_matrix.length; i++) {
					assert.throws(() => bellman_ford_alg_1(adj_matrix, i), NegativeCycleDetectedException);
				}
			});
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
			min_cost: 348,
			cost_matrix: [
				[0, 30, 64, 132, 226, 348],
				[U, 0, 24, 72, 156, 268],
				[U, U, 0, 72, 198, 366],
				[U, U, U, 0, 168, 392],
				[U, U, U, U, 0, 336],
				[U, U, U, U, U, 0],
			],
			firsttail_matrix: [
				[U, 0, 0, 0, 0, 0],
				[U, U, 1, 2, 3, 4],
				[U, U, U, 2, 3, 4],
				[U, U, U, U, 3, 4],
				[U, U, U, U, U, 4],
				[U, U, U, U, U, U],
			],
			order: [0, [[[[1, 2], 3], 4], 5]],
		};

		it('correct', function() {
			let result = consecutive_matrix_multiplication(matrix_sizes);
			let min_cost = result.cost_matrix[0][n-1];
			let order = reconstructOrder(0, n-1, result.firsttail_matrix);

			assert.strictEqual(min_cost, expected_result.min_cost);
			assert.deepStrictEqual(order, expected_result.order);
			assert.deepStrictEqual(result.cost_matrix, expected_result.cost_matrix);
			assert.deepStrictEqual(result.firsttail_matrix, expected_result.firsttail_matrix);
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
				[U, 0, 3, 5, 8],
				[U, U, 0, 1, 3],
				[U, U, U, 0, 1],
				[U, U, U, U, 0],
			],
			rootnode_matrix: [
				[U, 0, 0, 1, 1],
				[U, U, 1, 1, 1],
				[U, U, U, 2, 2],
				[U, U, U, U, 3],
				[U, U, U, U, U],
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
			[0, 2, 9, I],
			[1, 0, 6, 4],
			[I, 7, 0, 8],
			[6, 3, I, 0],
		];

		let n = adj_matrix.length;

		let expected_result = {
			min_distance: 21,
			shortest_path: [0, 2, 3, 1],
		};

		it('alg 1 correct', function() {
			let result = traveling_salesman_1(adj_matrix);

			assert.strictEqual(result.min_distance, expected_result.min_distance);
			assert.deepStrictEqual(result.shortest_path, expected_result.shortest_path);
		});
		it('alg 2 correct', function() {
			let result = traveling_salesman_2(adj_matrix);

			assert.strictEqual(result.min_distance, expected_result.min_distance);
			assert.deepStrictEqual(result.shortest_path, expected_result.shortest_path);
		});
	});
	describe('sequence_alignment', function() {
		let { sequence_alignment, reconstructPath } = require('../dynamic_programming/sequence_alignment');

		let s1 = 'UUUATCGATCGUZZZ', s2 = 'UUUZATCKKTCGZZZ';
		let m = s1.length, n = s2.length;

		let expected_result = {
			min_cost: 6,
			alignment: {
				s1: ['U','U','U',null,'A','T','C','G','A','T','C','G','U','Z','Z','Z'],
				s2: ['U','U','U','Z','A','T','C','K','K','T','C','G',null,'Z','Z','Z'],
			},
		};

		it('correct', function() {
			let result = sequence_alignment(s1, s2, { unmatch_penalty: 1, gap_penalty: 2 });

			let min_cost = result.cost_matrix[m][n];
			assert.strictEqual(min_cost, expected_result.min_cost);

			let alignment = reconstructPath(s1, s2, result.choose_matrix);
			assert.deepStrictEqual(alignment.s1, expected_result.alignment.s1);
			assert.deepStrictEqual(alignment.s2, expected_result.alignment.s2);
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
			assert.strictEqual(result, expected_result);
		});
		it('alg 2 (bidirectional) correct', function() {
			let result = the_0_1_knapsack_bidirectional(item_data, knapsack_capacity);
			assert.strictEqual(result, expected_result);
		});
	});
	describe('coin_change', function() {
		let {
			coin_change_combinations,
			coin_change_combinations_recursive,
			coin_change_minimal_coins,
			coin_change_minimal_coins_recursive,
		} = require('../dynamic_programming/coin_change');

		let coin_values = [2, 3, 5, 7];
		let target_value = 21;

		let expected_result = {
			combinations_matrix: [
				[ 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
				[ 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0 ],
				[ 1, 0, 1, 1, 1, 1, 2, 1, 2, 2, 2, 2, 3, 2, 3, 3, 3, 3, 4, 3, 4, 4 ],
				[ 1, 0, 1, 1, 1, 2, 2, 2, 3, 3, 4, 4, 5, 5, 6, 7, 7, 8, 9, 9, 11, 11 ],
				[ 1, 0, 1, 1, 1, 2, 2, 3, 3, 4, 5, 5, 7, 7, 9, 10, 11, 13, 14, 16, 18, 20 ],
			],
			combinations_count: 20,
			minimal_coins_matrix: [
				[ 0, I, I, I, I, I, I, I, I, I, I, I, I, I, I, I, I, I, I, I, I, I ],
				[ 0, I, 1, I, 2, I, 3, I, 4, I, 5, I, 6, I, 7, I, 8, I, 9, I, 10, I ],
				[ 0, I, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5, 6, 6, 6, 7, 7, 7 ],
				[ 0, I, 1, 1, 2, 1, 2, 2, 2, 3, 2, 3, 3, 3, 4, 3, 4, 4, 4, 5, 4, 5 ],
				[ 0, I, 1, 1, 2, 1, 2, 1, 2, 2, 2, 3, 2, 3, 2, 3, 3, 3, 4, 3, 4, 3 ],
			],
			minimal_coins_count: 3,
		};

		it('coin_change_combinations is correct', function() {
			let result = coin_change_combinations(coin_values, target_value);
			assert.deepStrictEqual(result, expected_result.combinations_matrix);
		});

		it('coin_change_combinations (recursive) is correct', function() {
			let result = coin_change_combinations_recursive(coin_values, target_value);
			assert.strictEqual(result, expected_result.combinations_count);
		});

		it('coin_change_minimal_coins is correct', function() {
			let result = coin_change_minimal_coins(coin_values, target_value);
			assert.deepStrictEqual(result, expected_result.minimal_coins_matrix);
		});

		it('coin_change_minimal_coins (recursive) is correct', function() {
			let result = coin_change_minimal_coins_recursive(coin_values, target_value);
			assert.strictEqual(result, expected_result.minimal_coins_count);
		});
	});
	describe('sum_of_subsets', function() {
		let {
			sum_of_subsets_combinations,
		} = require('../dynamic_programming/sum_of_subsets');

		let values = [-7, -3, -2, +5, +8];

		let expected_result = {
			dp_possible: [
				[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
				[ 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
				[ 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
				[ 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
				[ 1, 0, 1, 1, 0, 2, 0, 2, 1, 1, 2, 0, 2, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0 ],
				[ 1, 0, 1, 1, 0, 2, 0, 2, 2, 1, 3, 1, 2, 2, 1, 3, 1, 2, 2, 0, 2, 0, 1, 1, 0, 1 ],
			],
			index_offset: 12,
		};

		it('sum_of_subsets_combinations is correct', function() {
			let result = sum_of_subsets_combinations(values);
			assert.strictEqual(result.index_offset, expected_result.index_offset);
			assert.deepStrictEqual(result.dp_possible, expected_result.dp_possible);
		});
	});
});
