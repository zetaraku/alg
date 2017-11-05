const assert = require('assert');

// algorithm to solve the 0/1 knapsack problem (using backtracking)
function the_0_1_knapsack({ item_values, item_weights }, total_capacity) {
	let n = item_values.length;

	let sorted_items = [...Array(n)]
		.map((_, j) => ({
			originalIndex: j,
			weight: item_weights[j],
			value: item_values[j],
			unit_value: item_values[j] / item_weights[j],
		}))
		.sort(
			(a, b) => b.unit_value - a.unit_value	// sort by descending order
		);

	let bag = [], accumulated_weight = 0, accumulated_value = 0;
	let current_best_value = -Infinity;

	let best_choice = null;

	sub_the_0_1_knapsack(0);

	return current_best_value;

	function sub_the_0_1_knapsack(i) {
		if(accumulated_value > current_best_value) {
			best_choice = bag.slice();
			current_best_value = accumulated_value;
		}

		if(isPromising(i, false)) {
			// console.log('\t'.repeat(i) + '-', i, 'w:'+accumulated_weight, 'v:'+accumulated_value);
			sub_the_0_1_knapsack(i+1);	// not choosing i
		}

		if(isPromising(i, true)) {
			{
				bag.push(sorted_items[i]);
				accumulated_weight += sorted_items[i].weight;
				accumulated_value += sorted_items[i].value;
			}
			// console.log('\t'.repeat(i) + '+', i, 'w:'+accumulated_weight, 'v:'+accumulated_value);
			sub_the_0_1_knapsack(i+1);	// choosing i
			{
				bag.pop();
				accumulated_weight -= sorted_items[i].weight;
				accumulated_value -= sorted_items[i].value;
			}
		}
	}

	function isPromising(i, choosed) {
		if(i >= n)
			return false;

		let new_weight = accumulated_weight + (choosed ? sorted_items[i].weight : 0);

		if(new_weight > total_capacity)
			return false;

		let new_value = accumulated_value + (choosed ? sorted_items[i].value : 0);

		let temp_weight = new_weight;
		let temp_value = new_value;

		// TODO: can be optimized
		for(let j = i+1; j < n; j++) {
			temp_weight += sorted_items[j].weight;
			temp_value += sorted_items[j].value;
			if(temp_weight > total_capacity) {
				temp_value -= (temp_weight - total_capacity) * sorted_items[j].unit_value;
				break;
			}
		}

		return temp_value > current_best_value;
	}
}

module.exports = { the_0_1_knapsack };
function test() {
	{
		let item_data = {
			item_values: [40, 30, 50, 10],
			item_weights: [2, 5, 10, 5],
		};
		let knapsack_capacity = 16;
		let expected_result = 90;

		let result = the_0_1_knapsack(item_data, knapsack_capacity);
		console.log('max value:', result);

		assert.strictEqual(result, expected_result);
	}
	{
		let item_data = {
			item_values: [50, 60, 140],
			item_weights: [5, 10, 20],
		};
		let knapsack_capacity = 30;
		let expected_result = 200;

		let result = the_0_1_knapsack(item_data, knapsack_capacity);
		console.log('max value:', result);

		assert.strictEqual(result, expected_result);
	}
}

test();
