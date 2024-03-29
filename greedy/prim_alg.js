const { createNDimArray } = require('../util/ndim_arr');

// the Prim's algorithm to find a minimum spanning tree for a weighted undirected graph
// Time complexity: O(n^2), where n = number of nodes
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
			the nearest node (from any node in tree) to node i in the current tree
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

module.exports = { prim_alg };
