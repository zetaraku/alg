const DisjointSet = require('../util/disjoint_set');

// the Kruskal's algorithm to find a minimum spanning tree for a weighted undirected graph
// Time complexity: O(m lg m), where m = number of edges
function kruskal_alg(adj_matrix) {
	let n = adj_matrix.length;

	let current_tree = {
		nodes: new Set(),
		edges: new Set(),
		cost: 0
	};

	if(n === 0)
		return current_tree;

	let available_edges = [];
	for(let i = 0; i < n; i++)
		for(let j = i+1; j < n; j++)
			if(adj_matrix[i][j] !== +Infinity)			// take only connected edges
				available_edges.push({ i, j, cost: adj_matrix[i][j] });

	available_edges.sort((a, b) => a.cost - b.cost);	// sort edges by cost in non-decreasing order

	let ds = new DisjointSet(n);

	while(available_edges.length !== 0) {
		let { i, j, cost } = available_edges.shift();	// take an edge which has the min cost

		let p = ds.find(i), q = ds.find(j);				// find the sets which i and j belong to
		if(p !== q) {			// if i and j are not in the same set
			current_tree.edges.add([i, j]);				// add the edge (i, j) into current_tree
			current_tree.cost += cost;

			ds.merge(p, q);		// merge set p and set q together

			if(current_tree.edges.size === n-1)
				break;			// it only needs n-1 edges for an n-node MST
		}
	}

	if(current_tree.edges.size < n-1)
		throw new Error('Input graph is not a connected graph.');

	for(let i = 0; i < n; i++)
		current_tree.nodes.add(i);

	return current_tree;
}

module.exports = { kruskal_alg };
