const { createNDimArray } = require('../util/ndim_arr');

class NegativeCycleDetectedException {
	constructor(data) {
		this.message = 'Negative cycle(s) detected.';
		this.name = 'NegativeCycleDetectedException';
		this.data = data;
	}
}

// Bellman-Ford algorithm (a 'parallel' version of dijkstra algorithm)
// Time complexity: O(n^3), where n = number of nodes
// Space complexity: O(n^2)
function bellman_ford_alg_1(adj_matrix, start_node) {
	let n = adj_matrix.length;

	/*
		dp_distance[k][i] =
			distance of shortest path from start_node to i
			using at most k edges
	*/
	let dp_distance = createNDimArray([n, n]); {
		for(let i = 0; i < n; i++)
			dp_distance[0][i] = +Infinity;
		dp_distance[0][start_node] = 0;
	}

	/*
		the Bellman–Ford algorithm simply relaxes all the edges, and does this n − 1 times.
		In each of these repetitions, the number of vertices with correctly calculated distances grows,
		from which it follows that eventually all vertices will have their correct distances.
	*/
	for(let k = 1; k < n; k++) {
		for(let i = 0; i < n; i++) {
			let shortest_distance_to_i = dp_distance[k-1][i];
			for(let j = 0; j < n; j++) {
				shortest_distance_to_i = Math.min(
					shortest_distance_to_i,
					dp_distance[k-1][j] + adj_matrix[j][i]
				);
			}
			dp_distance[k][i] = shortest_distance_to_i;
		}
	}

	/*
		If there are any negative cycles,
		the cost will be able to reduce further.
	*/
	for(let i = 0; i < n; i++)
		for(let j = 0; j < n; j++)
			if(dp_distance[n-1][i] + adj_matrix[i][j] < dp_distance[n-1][j])
				throw new NegativeCycleDetectedException(dp_distance);

	return dp_distance[n-1];
}

module.exports = {
	bellman_ford_alg_1,
	// reconstructPath,
	// reconstructSimpleCycle,
	NegativeCycleDetectedException,
};
