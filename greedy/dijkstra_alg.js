// Dijkstra's algorithm (similar to prim_alg.js)
// Time complexity: O(n^2), where n = number of nodes
// * There exists another implementation for better time complexity by using heap
function dijkstra_alg(adj_matrix, start_node) {
	let n = adj_matrix.length;

	if(!(Number.isInteger(start_node) && 0 <= start_node && start_node < n))
		throw new Error('Invalid start node.');

	let current_tree = {
		nodes: new Set(),
		edges: new Set(),
	};

	/*
		distance_from_start[i] =
			min distance to node i from start_node
	*/
	let distance_from_start = Array(n);

	/*
		nearest_node_in_current_tree_to[i] =
			the nearest node (from start_node) to node i in the current tree
	*/
	let nearest_node_in_current_tree_to = Array(n);

	/*
		prev_node[i] =
			the previous node of the shortest path from start_node to node i
	*/
	let prev_node = Array(n);

	current_tree.nodes.add(start_node);
	prev_node[start_node] = null;

	for(let i = 0; i < n; i++) {
		distance_from_start[i] = adj_matrix[start_node][i];
		nearest_node_in_current_tree_to[i] = start_node;
	}

	while(current_tree.nodes.size !== n) {
		// find the nearest node
		let min_distance = +Infinity;
		let selected_node = null;
		for(let i = 0; i < n; i++) {
			if(current_tree.nodes.has(i))
				continue;
			if(distance_from_start[i] < min_distance) {
				min_distance = distance_from_start[i];
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
		prev_node[selected_node] = nearest_node_in_current_tree_to[selected_node];

		// update the distance and nearest node
		for(let i = 0; i < n; i++) {
			if(current_tree.nodes.has(i))
				continue;
			// primary different part from prim_alg
			let new_distance = distance_from_start[selected_node] + adj_matrix[selected_node][i];
			if(new_distance < distance_from_start[i]) {
				distance_from_start[i] = new_distance;
				nearest_node_in_current_tree_to[i] = selected_node;
			}
		}
	}

	return { distance: distance_from_start, prev_node_in_path: prev_node, tree: current_tree };
}

module.exports = { dijkstra_alg };
