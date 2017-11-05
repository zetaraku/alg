const assert = require('assert');

describe('chap.04 greedy', function() {
	describe('prim_alg', function() {
		let { prim_alg } = require('../greedy/prim_alg');

		let adj_matrix = [
			[0, 1, 3, Infinity, Infinity],
			[1, 0, 3, 6, Infinity],
			[3, 3, 0, 4, 2],
			[Infinity, 6, 4, 0, 5],
			[Infinity, Infinity, 2, 5, 0],
		];

		let expected_result = {
			nodes: new Set([0, 1, 2, 3, 4]),
			edges: new Set([
				[0, 1],
				[0, 2],
				[2, 4],
				[2, 3],
			]),
			cost: 10,
		};

		it('correct', function() {
			let result = prim_alg(adj_matrix);

			// console.log(result);

			assert.deepStrictEqual(result, expected_result);
		});
	});
	describe('kruskal_alg', function() {
		let { kruskal_alg } = require('../greedy/kruskal_alg');

		let adj_matrix = [
			[0, 1, 3, Infinity, Infinity],
			[1, 0, 3, 6, Infinity],
			[3, 3, 0, 4, 2],
			[Infinity, 6, 4, 0, 5],
			[Infinity, Infinity, 2, 5, 0],
		];

		let expected_result = {
			nodes: new Set([0, 1, 2, 3, 4]),
			edges: new Set([
				[0, 1],
				[2, 4],
				[0, 2],
				[2, 3],
			]),
			cost: 10,
		};

		it('correct', function() {
			let result = kruskal_alg(adj_matrix);

			// console.log(result);

			assert.deepStrictEqual(result, expected_result);
		});
	});
	describe('dijkstra_alg', function() {
		let { dijkstra_alg } = require('../greedy/dijkstra_alg');

		let adj_matrix = [
			[0, 7, 4, 6, 1],
			[Infinity, 0, Infinity, Infinity, Infinity],
			[Infinity, 2, 0, 5, Infinity],
			[Infinity, 3, Infinity, 0, Infinity],
			[Infinity, Infinity, Infinity, 1, 0],
		];

		let expected_result = {
			distance: [0, 5, 4, 2, 1],
			prev_node_in_path: [null, 3, 0, 4, 0],
			tree: {
				nodes: new Set([0, 1, 2, 3, 4]),
				edges: new Set([
					[0, 4],
					[4, 3],
					[0, 2],
					[3, 1],
				]),
			},
		};

		it('correct', function() {
			let result = dijkstra_alg(adj_matrix, 0);

			// console.log(result);

			assert.deepStrictEqual(result, expected_result);
		});
	});
	describe('huffman_coding', function() {
		let { huffman_coding } = require('../greedy/huffman_coding');

		let dictionary = new Map([
			['a', 16],
			['b', 5],
			['c', 12],
			['d', 17],
			['e', 10],
			['f', 25],
		]);

		let expected_result = {
			frequency: 85,
			left: {
				frequency: 33,
				left: {
					symbol: 'a',
					frequency: 16
				},
				right: {
					symbol: 'd',
					frequency: 17
				}
			},
			right: {
				frequency: 52,
				left: {
					symbol: 'f',
					frequency: 25
				},
				right: {
					frequency: 27,
					left: {
						symbol: 'c',
						frequency: 12
					},
					right: {
						frequency: 15,
						left: {
							symbol: 'b',
							frequency: 5
						},
						right: {
							symbol: 'e',
							frequency: 10
						}
					}
				}
			}
		};

		it('correct', function() {
			let result = huffman_coding(dictionary);	// the Huffman tree

			// console.log(JSON.stringify(result, null, '\t'));

			assert.deepStrictEqual(result, expected_result);
		});
	});
});
