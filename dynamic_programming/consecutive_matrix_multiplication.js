const assert = require('assert');
const { createNDimArray } = require('../util/ndim_arr');
const FIRST = 0, SECOND = 1;

// Consecutive matrix multiplication
function consecutive_matrix_multiplication(matrix_sizes) {
	let n = matrix_sizes.length - 1;

	let dp_cost = createNDimArray([n, n]);
	let dp_firsttail = createNDimArray([n, n]);

	for(let d = 0; d < n; d++)
		dp_cost[d][d] = 0;

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

function test() {
	let matrix_sizes = [5, 2, 3, 4, 6, 7, 8];
	let n = matrix_sizes.length - 1;

	let expected_result = {
		cost_matrix: [
			[0, 30, 64, 132, 226, 348],
			[undefined, 0, 24, 72, 156, 268],
			[undefined, undefined, 0, 72, 198, 366],
			[undefined, undefined, undefined, 0, 168, 392],
			[undefined, undefined, undefined, undefined, 0, 336],
			[undefined, undefined, undefined, undefined, undefined, 0]
		],
		firsttail_matrix: [
			[undefined, 0, 0, 0, 0, 0],
			[undefined, undefined, 1, 2, 3, 4],
			[undefined, undefined, undefined, 2, 3, 4],
			[undefined, undefined, undefined, undefined, 3, 4],
			[undefined, undefined, undefined, undefined, undefined, 4],
			[undefined, undefined, undefined, undefined, undefined, undefined]
		],
		order: [0, [[[[1, 2], 3], 4], 5]]
	};

	let result = consecutive_matrix_multiplication(matrix_sizes);
	let order = reconstructOrder(0, n-1, result.firsttail_matrix);

	console.log('min cost:', result.cost_matrix[0][n-1]);
	console.log('order:', JSON.stringify(order));

	assert.deepStrictEqual(result.cost_matrix, expected_result.cost_matrix);
	assert.deepStrictEqual(result.firsttail_matrix, expected_result.firsttail_matrix);
	assert.deepStrictEqual(order, expected_result.order);
}

test();