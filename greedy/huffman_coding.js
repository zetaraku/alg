const PriorityQueue = require('../util/FastPriorityQueue');

// algorithm to build the Huffman tree
function huffman_coding(dictionary) {
	// use PriorityQueue as the tree set
	let treePrioritySet = new PriorityQueue(
		// elements having a lower frequency have higher priority
		(a, b) => a.frequency < b.frequency
	);

	// make nodes for each symbol in the dictionary
	let tree_nodes =
		[...dictionary.entries()]
			.map(([k, v]) => ({
				symbol: k,
				frequency: v,
				// left: null,
				// right: null,
			}));

	// initialize the PriorityQueue with tree_nodes and heapify them
	treePrioritySet.heapify(tree_nodes);

	// keep merging trees while there are more than 1 tree
	while(treePrioritySet.size > 1) {
		// take the top two nodes that have the lowest frequency
		let p = treePrioritySet.poll();
		let q = treePrioritySet.poll();

		// make a merged tree with them
		let r = {
			// symbol: null,
			frequency: p.frequency + q.frequency,
			left: p,
			right: q,
		};

		// put the merged tree back
		treePrioritySet.add(r);
	}

	return treePrioritySet.poll();	// return the only tree
}

module.exports = { huffman_coding };
