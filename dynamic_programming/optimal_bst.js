const assert = require('assert');
const { createNDimArray } = require('../util/ndim_arr');

// Optimal binary searching tree
function optimal_bst(access_prob) {
	let n = access_prob.length;

	/*
		(period_access_prob[i] - period_access_prob[j]) =
			sum of access_prob [i, j)
	*/
	let period_access_prob = Array(n+1);
	period_access_prob[n] = 0;
	for(let i = n-1, acc = 0; i >= 0; i--) {
		acc += access_prob[i];
		period_access_prob[i] = acc;
	}

	/*
		dp_cost[i][j] =
			least search cost of interval [i, j)
	*/
	let dp_cost = createNDimArray([n+1, n+1]);

	/*
		dp_rootnode[i][j] =
			the root node of the nodes in interval [i, j) which has the least search cost
	*/
	let dp_rootnode = createNDimArray([n+1, n+1]);

	for(let i = 0; i <= n; i++)
		dp_cost[i][i] = 0;

	for(let d = 1; d <= n; d++) {
		for(let s = 0; s <= n - d; s++) {
			let i = s, j = s + d;
			dp_cost[i][j] = +Infinity;
			let cmp_cost = (
				period_access_prob[i] - period_access_prob[j]
			);
			for(let k = i; k < j; k++) {
				let cost = (dp_cost[i][k] + dp_cost[k+1][j]) + cmp_cost;
				if(cost < dp_cost[i][j]) {
					dp_cost[i][j] = cost;
					dp_rootnode[i][j] = k;
				}
			}
		}
	}

	return { cost_matrix: dp_cost, rootnode_matrix: dp_rootnode };
}

function reconstructTree(i, j, rootnode_matrix) {
	return reconstructTree_sub(i, j);

	function reconstructTree_sub(i, j) {
		if(i === j)
			return null;
		let rootnode = rootnode_matrix[i][j];
		return {
			key: rootnode,
			left: reconstructTree_sub(i, rootnode),
			right: reconstructTree_sub(rootnode+1, j),
		};
	}
}

function test() {
	let access_prob = [3, 3, 1, 1];
	let n = access_prob.length;

	// assume the data sum to 100% probability
	let total_base = access_prob.reduce((a, b) => a + b, 0);
	// or set the base manually
	// let total_base = 1;

	let expected_result = {
		cost_matrix: [
			[0, 3, 9, 11, 14],
			[undefined, 0, 3, 5, 8],
			[undefined, undefined, 0, 1, 3],
			[undefined, undefined, undefined, 0, 1],
			[undefined, undefined, undefined, undefined, 0]
		],
		rootnode_matrix: [
			[undefined, 0, 0, 1, 1],
			[undefined, undefined, 1, 1, 1],
			[undefined, undefined, undefined, 2, 2],
			[undefined, undefined, undefined, undefined, 3],
			[undefined, undefined, undefined, undefined, undefined]
		],
		tree: {
			key: 1,
			left: {
				key: 0,
				left: null,
				right: null
			},
			right: {
				key: 2,
				left: null,
				right: {
					key: 3,
					left: null,
					right: null
				}
			}
		}
	};

	let result = optimal_bst(access_prob);
	let tree = reconstructTree(0, n, result.rootnode_matrix);

	console.log('min cost:', result.cost_matrix[0][n] / total_base);
	console.log('tree:', JSON.stringify(tree));

	assert.deepStrictEqual(result.cost_matrix, expected_result.cost_matrix);
	assert.deepStrictEqual(result.rootnode_matrix, expected_result.rootnode_matrix);
	assert.deepStrictEqual(tree, expected_result.tree);
}

test();
