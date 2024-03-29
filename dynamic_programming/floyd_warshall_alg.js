const { createNDimArray, copyNDimArray } = require('../util/ndim_arr');

class NegativeCycleDetectedException {
	constructor(data) {
		this.message = 'Negative cycle(s) detected.';
		this.name = 'NegativeCycleDetectedException';
		this.data = data;
	}
}

// Floyd-Warshall algorithm (original version)
// Time complexity: O(n^3), where n = number of nodes
// Space complexity: O(n^3)
function floyd_warshall_alg_1(adj_matrix) {
	let n = adj_matrix.length;

	/*
		dp_distance[k][i][j] =
			distance of shortest path from i to j
			only using nodes in first k nodes (node 0 ~ k-1) as intermediate nodes
	*/
	let dp_distance = createNDimArray([n+1, n, n]);
	dp_distance[0] = copyNDimArray(adj_matrix);

	for(let k = 0; k < n; k++)
		for(let i = 0; i < n; i++)
			for(let j = 0; j < n; j++)
				dp_distance[k+1][i][j] = Math.min(
					dp_distance[k][i][j],
					dp_distance[k][i][k] + dp_distance[k][k][j]
				);

	/*
		If there are any negative cycles,
		any node on any negative cycle will have negative cost to itself,
		since it can go thorough a negative cycle
		and reduce the cost to itself to a negative number.
	*/
	for(let i = 0; i < n; i++)
		if(dp_distance[n][i][i] < 0)
			throw new NegativeCycleDetectedException(dp_distance[n]);

	return dp_distance[n];
}

// Floyd-Warshall algorithm (memory optimized version)
// Time complexity: O(n^3), where n = number of nodes
// Space complexity: O(n^2)
function floyd_warshall_alg_2(adj_matrix) {
	let n = adj_matrix.length;

	let dp_distance = copyNDimArray(adj_matrix);
	/*
		dp_distance[i][j] (after k iterations) =
			distance of shortest path from i to j
			only using nodes in first k nodes (node 0 ~ k-1) as intermediate nodes

		[Space usage optimization]
		Assume there's no negative cycle (dp_distance[x][x] == 0).
		During the k-th iteration,
		because dp_distance[i][k] = Math.min(
			dp_distance[i][k],
			dp_distance[i][k] + dp_distance[k][k]
		) = dp_distance[i][k],
		and dp_distance[k][j] = Math.min(
			dp_distance[k][j],
			dp_distance[k][k] + dp_distance[k][j]
		) = dp_distance[k][j],
		dp_distance[_][k] and dp_distance[k][_] don't change!
		(as dp_distance[k][i][k] == dp_distance[k-1][i][k] and dp_distance[k][k][j] == dp_distance[k-1][k][j])
		so we can use the current dp_distance as previous dp_distance
		(whatever the value of dp_distance[_][k] and dp_distance[k][_] are old or new)
	*/
	for(let k = 0; k < n; k++)
		for(let i = 0; i < n; i++)
			for(let j = 0; j < n; j++)
				dp_distance[i][j] = Math.min(
					dp_distance[i][j],
					dp_distance[i][k] + dp_distance[k][j]
				);

	for(let i = 0; i < n; i++)
		if(dp_distance[i][i] < 0)
			throw new NegativeCycleDetectedException(dp_distance);

	return dp_distance;
}

// Floyd-Warshall algorithm (floyd_warshall_alg_2 + path finding)
function floyd_warshall_alg_3(adj_matrix) {
	let n = adj_matrix.length;

	let dp_distance = copyNDimArray(adj_matrix);

	/*
		dp_nextnode[i][j] =
			the next node of the shortest path if we're at i and want to go to j
	*/
	let dp_nextnode = createNDimArray([n, n]);
	for(let i = 0; i < n; i++)
		for(let j = 0; j < n; j++)
			dp_nextnode[i][j] = j;

	for(let k = 0; k < n; k++) {
		for(let i = 0; i < n; i++) {
			for(let j = 0; j < n; j++) {
				if(dp_distance[i][k] + dp_distance[k][j] < dp_distance[i][j]) {
					dp_distance[i][j] = dp_distance[i][k] + dp_distance[k][j];
					/*
						Update only if we choose the path i -> k -> j.
						If we have to go from i to k to j,
						we must first go from i to k,
						that is, we must first go to the next node of the trip from i to k
					*/
					dp_nextnode[i][j] = dp_nextnode[i][k];
				}
			}
		}
	}

	for(let i = 0; i < n; i++)
		if(dp_distance[i][i] < 0)
			throw new NegativeCycleDetectedException(
				{ distance_matrix: dp_distance, nextnode_matrix: dp_nextnode }
			);

	return { distance_matrix: dp_distance, nextnode_matrix: dp_nextnode };
}

function reconstructPath(u, v, nextnode_matrix) {
	let _path = [u]
	while(u !== v)
		_path.push(u = nextnode_matrix[u][v]);

	return _path;
}

function reconstructSimpleCycle(index, nextnode_matrix) {
	let traveled_nodes = new Set();

	let edges = [];

	let [u, v] = [undefined, index];
	traveled_nodes.add(index);

	let knot = undefined;
	while(true) {
		[u, v] = [v, nextnode_matrix[v][index]];
		edges.push({ u, v });

		if(traveled_nodes.has(v)) {
			knot = v;
			break;
		}

		traveled_nodes.add(v);
	}

	let startIndex = edges.findIndex((edge) => edge.u === knot);
	edges.splice(0, startIndex);

	return edges;
}

module.exports = {
	floyd_warshall_alg_1,
	floyd_warshall_alg_2,
	floyd_warshall_alg_3,
	reconstructPath,
	reconstructSimpleCycle,
	NegativeCycleDetectedException,
};
