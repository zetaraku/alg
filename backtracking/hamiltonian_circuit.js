const assert = require('assert');

// algorithm to solve the Hamiltonian circuit problem
// Worst Time Complexity: O(n^n), n = number of vertexes
function hamiltonian_circuit(adj_matrix) {
	let n = adj_matrix.length;

	let path_stack = [];

	let results = [];

	const FIRST_NODE_ID = 0;

	path_stack.push(FIRST_NODE_ID);		// force a starting point
	sub_hamiltonian_circuit(1);			// start from second vertex

	return results;

	function sub_hamiltonian_circuit(i) {
		for(let nodeId = 0; nodeId < n; nodeId++) {
			if(isPromising(i, nodeId)) {
				path_stack.push(nodeId);

				if(path_stack.length === n) {
					if(adj_matrix[nodeId][FIRST_NODE_ID])	// found a Hamiltonian circuit
						results.push(path_stack.slice());
					else									// only a Hamiltonian path
						/* do nothing */;
				} else {
					sub_hamiltonian_circuit(i+1);
				}

				path_stack.pop();
			}
		}
	}

	function isPromising(i, nodeId) {
		let lastNodeId = path_stack[i-1];
		return (
			adj_matrix[lastNodeId][nodeId]
			&& path_stack.every((previousNodeId) => previousNodeId !== nodeId)
		);
	}
}

function test() {
	let adj_matrix = [
		[false, true, true, false, false, false, true, true, false],
		[true, false, true, false, false, false, true, true, false],
		[true, true, false, true, false, true, false, false, false],
		[false, false, true, false, true, false, false, false, false],
		[false, false, false, true, false, true, false, false, false],
		[false, false, true, false, true, false, true, false, false],
		[true, true, false, false, false, true, false, true, false],
		[true, true, false, false, false, false, true, false, false],
	];
	let expected_results = [
		[0, 1, 2, 3, 4, 5, 6, 7],
		[0, 1, 7, 6, 5, 4, 3, 2],
		[0, 2, 3, 4, 5, 6, 1, 7],
		[0, 2, 3, 4, 5, 6, 7, 1],
		[0, 6, 5, 4, 3, 2, 1, 7],
		[0, 7, 1, 2, 3, 4, 5, 6],
		[0, 7, 1, 6, 5, 4, 3, 2],
		[0, 7, 6, 5, 4, 3, 2, 1],
	]

	let results = hamiltonian_circuit(adj_matrix);

	console.log(results);

	assert.deepStrictEqual(results, expected_results);
}

test();
