const { createNDimArray } = require('../util/ndim_arr');

// algorithm to solve the coin change problem (bottom-up)
// Time complexity: O(KN), where K = number of types of coin, N = total price
// Space complexity: O(KN)

function coin_change_combinations(coin_values, target_value) {
	let K = coin_values.length;
	let N = target_value;

	/*
		dp_combinations[k][n] =
			the number of all possible combinations to form exact n value
			choosing from first k coins (0 ~ k-1)
	*/
	let dp_combinations = createNDimArray([K+1, N+1]);

	for(let n = 0; n <= N; n++)
		dp_combinations[0][n] = 0;
	for(let k = 0; k <= K; k++)
		dp_combinations[k][0] = 1;

	for(let k = 1; k <= K; k++)
		for(let n = 1; n <= N; n++)
			if(n >= coin_values[k-1])
				dp_combinations[k][n] = dp_combinations[k-1][n] + dp_combinations[k][n-coin_values[k-1]];
			else
				dp_combinations[k][n] = dp_combinations[k-1][n];

	return dp_combinations;
}

function coin_change_minimal_coins(coin_values, target_value) {
	let K = coin_values.length;
	let N = target_value;

	/*
		dp_minimal_coins[k][n] =
			the minimal number of coin needed to form exact n value
			choosing from first k coins (0 ~ k-1)
	*/
	let dp_minimal_coins = createNDimArray([K+1, N+1]);

	for(let n = 0; n <= N; n++)
		dp_minimal_coins[0][n] = +Infinity;
	for(let k = 0; k <= K; k++)
		dp_minimal_coins[k][0] = 0;

	for(let k = 1; k <= K; k++)
		for(let n = 1; n <= N; n++)
			if(n >= coin_values[k-1])
				dp_minimal_coins[k][n] = Math.min(
					0 + dp_minimal_coins[k-1][n],
					1 + dp_minimal_coins[k  ][n-coin_values[k-1]]
				);
			else
				dp_minimal_coins[k][n] = Math.min(
					0 + dp_minimal_coins[k-1][n],
					+Infinity
				);

	return dp_minimal_coins;
}

// algorithm to solve the coin change problem (recursive, not optimized)

function coin_change_combinations_recursive(coin_values, target_value) {
	let K = coin_values.length;
	let N = target_value;

	return _sub(coin_values, K, N);

	function _sub(coin_values, k, n) {
		if(n < 0)
			return 0;
		if(n == 0)
			return 1;
		if(n > 0)
			if(k <= 0)
				return 0;
			else
				return (
					  _sub(coin_values, k-1, n)
					+ _sub(coin_values, k  , n-coin_values[k-1])
				);
		// this will never be reached
	}
}

function coin_change_minimal_coins_recursive(coin_values, target_value) {
	let K = coin_values.length;
	let N = target_value;

	return _sub(coin_values, K, N);

	function _sub(coin_values, k, n) {
		if(n < 0)
			return +Infinity;
		if(n == 0)
			return 0;
		if(n > 0)
			if(k <= 0)
				return +Infinity;
			else
				return Math.min(
					0 + _sub(coin_values, k-1, n),
					1 + _sub(coin_values, k  , n-coin_values[k-1])
				);
		// this will never be reached
	}
}

module.exports = {
	coin_change_combinations,
	coin_change_combinations_recursive,
	coin_change_minimal_coins,
	coin_change_minimal_coins_recursive,
};
