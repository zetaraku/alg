const PriorityQueue = require('../util/FastPriorityQueue');

// algorithm to solve the 0/1 knapsack problem (using best-first-search)
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

	let current_best_value = -Infinity;
	let best_node = null;

	let processingQueue = new PriorityQueue(
		// elements having a higher upper_bound have higher priority
		(a, b) => b.upper_bound < a.upper_bound
	);

	let root_node = {
		parent: null,
		children: [],
		level: -1,
		choosed: undefined,
		weight: 0,
		value: 0,
		upper_bound: undefined,
	};
	root_node.upper_bound = calcUpperBound(root_node);

	processingQueue.add(root_node);

	while(!processingQueue.isEmpty()) {
		let node = processingQueue.poll();	// take a node that has the highest upper_bound
		let i = node.level;

		if(node.upper_bound <= current_best_value)	// current_best_value may increase, check again
			continue;

		if(node.value > current_best_value) {
			best_node = node;
			current_best_value = node.value;
		}

		if(i+1 < n) {	// if there is a next item to choose
			// not choosing i+1
			{
				let child_node = {
					parent: node,
					children: [],
					level: i+1,
					choosed: false,
					weight: node.weight,
					value: node.value,
					upper_bound: undefined,
				};
				child_node.upper_bound = calcUpperBound(child_node);

				if(isPromising(child_node)) {
					node.children.push(child_node);
					processingQueue.add(child_node);
				}
			}

			// choosing i+1
			{
				let child_node = {
					parent: node,
					children: [],
					level: i+1,
					choosed: true,
					weight: node.weight + sorted_items[i+1].weight,
					value: node.value + sorted_items[i+1].value,
					upper_bound: undefined,
				};
				child_node.upper_bound = calcUpperBound(child_node);

				if(isPromising(child_node)) {
					node.children.push(child_node);
					processingQueue.add(child_node);
				}
			}
		}
	}

	// traverseTree(root_node);	// print the state space tree

	return current_best_value;

	function calcUpperBound(node) {
		let i = node.level;

		let temp_weight = node.weight;
		let temp_value = node.value;

		// TODO: can be optimized
		for(let j = i+1; j < n; j++) {
			temp_weight += sorted_items[j].weight;
			temp_value += sorted_items[j].value;
			if(temp_weight > total_capacity) {
				temp_value -= (temp_weight - total_capacity) * sorted_items[j].unit_value;
				break;
			}
		}

		return temp_value;
	}

	function isPromising(node) {
		if(node.weight > total_capacity)
			return false;

		return node.upper_bound > current_best_value;
	}

	function traverseTree(node) {
		if(node.level >= 0)
			console.log(
				'\t'.repeat(node.level) + (node.choosed ? '+' : '-'),
				'w:'+node.weight, 'v:'+node.value, 'uv:'+node.upper_bound,
			);
		for(let child_node of node.children)
			traverseTree(child_node);
	}
}

module.exports = { the_0_1_knapsack };
