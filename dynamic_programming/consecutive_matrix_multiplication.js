const { createNDimArray } = require('../util/ndim_arr');
const FIRST = 0, SECOND = 1;

// algorithm to find the best order to do consecutive matrix multiplication
// Time complexity: O(n^3), where n = number of matrix
// Space complexity: O(n^2)
function consecutive_matrix_multiplication(matrix_sizes) {
	let n = matrix_sizes.length - 1;

	/*
		dp_cost[i][j] =
			least multiplication cost of interval [i, j]
	*/
	let dp_cost = createNDimArray([n, n]);

	/*
		dp_firsttail[i][j] =
			tail of the first interval of interval [i, j] which has the least multiplication cost
	*/
	let dp_firsttail = createNDimArray([n, n]);

	for(let i = 0; i < n; i++)
		dp_cost[i][i] = 0;

	for(let d = 1; d < n; d++) {
		for(let s = 0; s < n - d; s++) {
			let i = s, j = s + d;
			dp_cost[i][j] = +Infinity;
			for(let k = i; k < j; k++) {
				let mult_cost = (
					matrix_sizes[(i)+(FIRST)] *
					matrix_sizes[(k)+(SECOND)] *
					matrix_sizes[(j)+(SECOND)]
				);
				let cost = (dp_cost[i][k] + dp_cost[k+1][j]) + mult_cost;
				if(cost < dp_cost[i][j]) {
					dp_cost[i][j] = cost;
					dp_firsttail[i][j] = k;
				}
			}
		}
	}

	return { cost_matrix: dp_cost, firsttail_matrix: dp_firsttail };
}

function reconstructOrder(i, j, firsttail_matrix) {
	return reconstructOrder_sub(i, j);

	function reconstructOrder_sub(i, j) {
		if(i === j)
			return i;
		return [
			reconstructOrder_sub(i, firsttail_matrix[i][j]),
			reconstructOrder_sub(firsttail_matrix[i][j]+1, j)
		];
	}
}

module.exports = { consecutive_matrix_multiplication, reconstructOrder };
