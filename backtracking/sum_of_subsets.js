// algorithm to solve the sub of subsets problem
// Worst Time Complexity: O(2^n), where n = number of items
function sum_of_subsets(item_weights, total_capacity) {
	let n = item_weights.length;

	let sorted_items = [...Array(n)]
		.map((_, j) => ({ originalIndex: j, weight: item_weights[j] }))
		.sort(
			(a, b) => a.weight - b.weight	// sort by ascending order
		);

	let sum_weight_to_end = Array(n+1); {
		sum_weight_to_end[n] = 0;
		for(let i = n-1; i >= 0; i--)
			sum_weight_to_end[i] = sorted_items[i].weight + sum_weight_to_end[i+1];
	}

	let bag = [], accumulated_weight = 0;

	let results = [];

	sub_sum_of_subsets(0);

	return results;

	function sub_sum_of_subsets(i) {
		if(accumulated_weight === total_capacity) {
			results.push(new Set(bag.map((e) => e.originalIndex)));
			return;
		}

		if(isPromising(i, false)) {
			// console.log('\t'.repeat(i) + '-', i, accumulated_weight);
			sub_sum_of_subsets(i+1);	// not choosing i
		}

		if(isPromising(i, true)) {
			{
				bag.push(sorted_items[i]);
				accumulated_weight += sorted_items[i].weight;
			}
			// console.log('\t'.repeat(i) + '+', i, accumulated_weight);
			sub_sum_of_subsets(i+1);	// choosing i
			{
				bag.pop();
				accumulated_weight -= sorted_items[i].weight;
			}
		}
	}

	function isPromising(i, choosed) {
		// if(i >= n)
		// 	return false;

		let new_weight = accumulated_weight + (choosed ? sorted_items[i].weight : 0);
		return (
			new_weight <= total_capacity
			&& new_weight + sum_weight_to_end[i+1] >= total_capacity
		);
	}
}

module.exports = { sum_of_subsets };
