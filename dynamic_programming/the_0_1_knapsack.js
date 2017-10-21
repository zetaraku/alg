const assert = require('assert');
const { createNDimArray } = require('../util/ndim_arr');

// algorithm to solve the 0/1 knapsack problem (bottom-up)
// Time complexity: O(nW), where n = number of items, W = total capacity
// Space complexity: O(nW)
function the_0_1_knapsack_bottom_up({ item_values, item_weights }, total_capacity) {
	let n = item_values.length;
	let W = total_capacity;

	/*
		dp_value[k][w] =
			the max total value of items choosing from first k items (0 ~ k-1) within w capacity
	*/
	let dp_value = createNDimArray([n+1, W+1]);

	{
		for(let w = 0; w <= W; w++) {
			dp_value[0][w] = 0;
		}
	}

	for(let k = 1; k <= n; k++) {
		for(let w = 0; w <= W; w++) {
			if(item_weights[(-1)+k] <= w) {
				dp_value[k][w] = Math.max(
					dp_value[k-1][w],
					dp_value[k-1][w - item_weights[(-1)+k]] + item_values[(-1)+k]
				);
			} else {
				dp_value[k][w] =
					dp_value[k-1][w];
			}
		}
	}

	return dp_value[n][W];
}

// algorithm to solve the 0/1 knapsack problem (top-down, then bottom-up)
// Time complexity: O(min(2^n, nW)), where n = number of items, W = total capacity
function the_0_1_knapsack_bidirectional({ item_values, item_weights }, total_capacity) {
	let n = item_values.length;
	let W = total_capacity;

	/*
		dp_value[k][w] =
			the max total value of items choosing from first k items (0 ~ k-1) within w capacity
	*/
	let dp_value = [...Array(n+1)].map(() => ({}));	// the second dimension is a sparse array

	// pre-calculate and mark which values are needed (top-down)
	dp_value[n][W] = null;
	for(let k = n; k >= 1; k--) {
		for(let w of Object.keys(dp_value[k])) {
			dp_value[k-1][w] = null;
			if(item_weights[(-1)+k] <= w)
				dp_value[k-1][w - item_weights[(-1)+k]] = null;
		}
	}

	// only calculate the value needed (bottom-up)
	{
		for(let w of Object.keys(dp_value[0])) {
			dp_value[0][w] = 0;
		}
	}
	for(let k = 1; k <= n; k++) {
		for(let w of Object.keys(dp_value[k])) {
			if(item_weights[(-1)+k] <= w) {
				dp_value[k][w] = Math.max(
					dp_value[k-1][w],
					dp_value[k-1][w - item_weights[(-1)+k]] + item_values[(-1)+k]
				);
			} else {
				dp_value[k][w] =
					dp_value[k-1][w];
			}
		}
	}

	return dp_value[n][W];
}

function test() {
	let item_data = {
		item_values: [50, 60, 140],
		item_weights: [5, 10, 20],
	};
	let knapsack_capacity = 30;
	let expected_result = 200;

	// test the_0_1_knapsack_bottom_up
	{
		let result = the_0_1_knapsack_bottom_up(item_data, knapsack_capacity);
		console.log('max value:', result);
		assert.strictEqual(result, expected_result);
	}

	// test the_0_1_knapsack_bidirectional
	{
		let result = the_0_1_knapsack_bidirectional(item_data, knapsack_capacity);
		console.log('max value:', result);
		assert.strictEqual(result, expected_result);
	}
}

test();
