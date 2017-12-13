const assert = require('assert');
const { createNDimArray } = require('../util/ndim_arr');

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
	describe('maximum_flow', function() {
		let {
			find_maximum_flow,
			find_maxflow_with_mincost,
		} = require('../greedy/maximum_flow');

		let n = 5;	// node count

		let edges = [
			{ from: 0, to: 1, capacity: 10, cost: 2 },
			{ from: 0, to: 2, capacity: 10, cost: 1 },
			{ from: 0, to: 3, capacity: 10, cost: 10 },
			{ from: 1, to: 3, capacity: 10, cost: 1 },
			{ from: 2, to: 3, capacity: 10, cost: 1 },
			{ from: 3, to: 4, capacity: 15, cost: 1 },
		];

		let flow_network_capacity = createNDimArray([n, n], 0);
		let path_cost = createNDimArray([n, n], +Infinity);

		let source = 0, sink = n-1;
		for(let edge of edges) {
			let { from, to, capacity, cost } = edge;
			flow_network_capacity[from][to] = capacity;
			path_cost[from][to] = cost;
		}

		it('should find_maximum_flow', function() {
			let result = find_maximum_flow(flow_network_capacity, source, sink);
			assert.strictEqual(result.value, 15);
		});
		it('should find_maxflow_with_mincost', function() {
			let result = find_maxflow_with_mincost(flow_network_capacity, path_cost, source, sink);
			assert.strictEqual(result.cost, 50);
		});
	});
});
