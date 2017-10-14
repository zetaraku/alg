const assert = require('assert');
const { createNDimArray } = require('../util/ndim_arr');

// the Prim's algorithm to find a minimum spanning tree for a weighted undirected graph
function prim_alg(adj_matrix) {
	let n = adj_matrix.length;

	let current_tree = {
		nodes: new Set(),
		edges: new Set(),
		cost: 0
	};

	if(n === 0)
		return current_tree;

	/*
		distance_from_current_tree[i] =
			min distance of node i to (any node of) the current tree
	*/
	let distance_from_current_tree = Array(n);

	/*
		nearest_node_in_current_tree_to[i] =
			the nearest node to node i in the current tree
	*/
	let nearest_node_in_current_tree_to = Array(n);

	const FIRST_NODE = 0;
	current_tree.nodes.add(FIRST_NODE);

	for(let i = 0; i < n; i++) {
		distance_from_current_tree[i] = adj_matrix[FIRST_NODE][i];
		nearest_node_in_current_tree_to[i] = FIRST_NODE;
	}

	while(current_tree.nodes.size < n) {
		// find the nearest node
		let min_distance = +Infinity;
		let selected_node = null;
		for(let i = 0; i < n; i++) {
			if(current_tree.nodes.has(i))
				continue;
			if(distance_from_current_tree[i] < min_distance) {
				min_distance = distance_from_current_tree[i];
				selected_node = i;
			}
		}

		if(selected_node === null)
			throw new Error('Input graph is not a connected graph.');

		current_tree.nodes.add(selected_node);

		let selected_edge = [
			nearest_node_in_current_tree_to[selected_node], selected_node
		];

		current_tree.edges.add(selected_edge);
		current_tree.cost += min_distance;

		// update the distance and nearest node
		for(let i = 0; i < n; i++) {
			if(current_tree.nodes.has(i))
				continue;
			if(adj_matrix[selected_node][i] < distance_from_current_tree[i]) {
				distance_from_current_tree[i] = adj_matrix[selected_node][i];
				nearest_node_in_current_tree_to[i] = selected_node;
			}
		}
	}

	return current_tree;
}

function test() {
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

	let result = prim_alg(adj_matrix);

	assert.deepStrictEqual(result, expected_result);

	console.log(result);
}

test();
