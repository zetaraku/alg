const assert = require('assert');
// Binomial coefficient calculation (optimized version)
function binomial_coef(n, k) {
	if(k > n / 2)
		k = n - k;

	let bc = Array(k+1).fill(1);
	for(let i = 0; i < n - k; i++)
		for(let j = 0; j < k; j++)
			bc[j+1] += bc[j];

	return bc[k];
}

function test() {
	assert.strictEqual(binomial_coef(0, 0), 1);
	assert.strictEqual(binomial_coef(10, 0), 1);
	assert.strictEqual(binomial_coef(10, 10), 1);
	assert.strictEqual(binomial_coef(25, 17), 1081575);
}

test();
