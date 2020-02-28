// algorithm to calculate binomial coefficient (memory optimized version)
// Time complexity: O(nk),
// Space complexity: O(k)
function binomial_coef(n, k) {
	if(k > n / 2)
		k = n - k;

	let bc = [...Array(k+1)].fill(1);
	for(let i = 0; i < n - k; i++)
		for(let j = 0; j < k; j++)
			bc[j+1] += bc[j];

	return bc[k];
}

module.exports = { binomial_coef };
