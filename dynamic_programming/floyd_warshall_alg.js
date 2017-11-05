const assert = require('assert');
const { createNDimArray, copyNDimArray } = require('../util/ndim_arr');

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
		for(let j = 0; j < n; j++)
			if(dp_distance[n][i][j] < 0)
				throw 'Negative cycle(s) detected.';

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
		for(let j = 0; j < n; j++)
			if(dp_distance[i][j] < 0)
				throw 'Negative cycle(s) detected.';

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
		for(let j = 0; j < n; j++)
			if(dp_distance[i][j] < 0)
				throw 'Negative cycle(s) detected.';

	return { distance_matrix: dp_distance, nextnode_matrix: dp_nextnode };
}

function reconstructPath(u, v, nextnode_matrix) {
	let _path = [u]
	while(u !== v)
		_path.push(u = nextnode_matrix[u][v]);

	return _path;
}

module.exports = {
	floyd_warshall_alg_1,
	floyd_warshall_alg_2,
	floyd_warshall_alg_3,
	reconstructPath,
};
function test() {
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

	// test floyd_warshall_alg_1
	{
		let result = floyd_warshall_alg_1(adj_matrix);
		assert.deepStrictEqual(result, expected_result);
	}

	// test floyd_warshall_alg_2
	{
		let result = floyd_warshall_alg_2(adj_matrix);
		assert.deepStrictEqual(result, expected_result);
	}

	// test floyd_warshall_alg_3
	{
		let result = floyd_warshall_alg_3(adj_matrix);

		let n = adj_matrix.length;
		for(let i = 0; i < n; i++)
			for(let j = 0; j < n; j++)
				console.log(
					`[${i}, ${j}] ` +
					reconstructPath(i, j, result.nextnode_matrix).join(' -> ') +
					` (${result.distance_matrix[i][j]})`
				);

		assert.deepStrictEqual(result.distance_matrix, expected_result);
	}
}

test();
