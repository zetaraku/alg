const { createNDimArray } = require('../util/ndim_arr');

// algorithm to solve the sum of subset problem (bottom-up)
// Time complexity: O(KR), where K = number of values, R = max_positive_sum - min_negative_sum
// Space complexity: O(KR)
function sum_of_subsets_combinations(values) {
	let K = values.length;

	let max_positive_sum = values.filter((v) => v > 0).reduce((acc, v) => acc + v, 0);
	let min_negative_sum = values.filter((v) => v < 0).reduce((acc, v) => acc + v, 0);
	let index_offset = -min_negative_sum;

	let dp_possible = createNDimArray([K+1, max_positive_sum - min_negative_sum + 1]);

	for(let i = min_negative_sum; i <= max_positive_sum; i++)
		dp_possible[0][index_offset+i] = 0;
	dp_possible[0][index_offset+0] = 1;

	for(let k = 1; k <= K; k++)
		for(let i = min_negative_sum; i <= max_positive_sum; i++)
			if(i-values[k-1] >= min_negative_sum && i-values[k-1] <= max_positive_sum)
				dp_possible[k][index_offset+i] = dp_possible[k-1][index_offset+i] + dp_possible[k-1][index_offset+i-values[k-1]];
			else
				dp_possible[k][index_offset+i] = dp_possible[k-1][index_offset+i];

	return {
		dp_possible, index_offset,
	};
}

module.exports = {
	sum_of_subsets_combinations,
};
