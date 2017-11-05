const assert = require('assert');
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

function test() {
	let dictionary = new Map([
		['a', 16],
		['b', 5],
		['c', 12],
		['d', 17],
		['e', 10],
		['f', 25],
	]);
	let expected_result = {
		frequency: 85,
		left: {
			frequency: 33,
			left: {
				symbol: 'a',
				frequency: 16
			},
			right: {
				symbol: 'd',
				frequency: 17
			}
		},
		right: {
			frequency: 52,
			left: {
				symbol: 'f',
				frequency: 25
			},
			right: {
				frequency: 27,
				left: {
					symbol: 'c',
					frequency: 12
				},
				right: {
					frequency: 15,
					left: {
						symbol: 'b',
						frequency: 5
					},
					right: {
						symbol: 'e',
						frequency: 10
					}
				}
			}
		}
	};

	let result = huffman_coding(dictionary);	// the Huffman tree

	console.log(JSON.stringify(result, null, '\t'));

	assert.deepStrictEqual(result, expected_result);
}

test();
