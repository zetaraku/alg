const { createNDimArray } = require('../util/ndim_arr');

// algorithm to find the optimal binary searching tree
// Time complexity: O(n^3), where n = number of nodes
// Space complexity: O(n^2)
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

	function access_prob_begin_end(begin, end) {
		return period_access_prob[begin] - period_access_prob[end];
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
			let cmp_cost = access_prob_begin_end(i, j);
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

module.exports = { optimal_bst, reconstructTree };
