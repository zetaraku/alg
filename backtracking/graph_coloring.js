const assert = require('assert');

// algorithm to solve the sub of subsets problem
// Worst Time Complexity: O(m^n), where m = number of colors, n = number of vertexes
function graph_coloring(adj_matrix, number_of_colors) {
	let n = adj_matrix.length;

	let color_of_vertex = Array(n);

	let results = [];

	sub_graph_coloring(0);

	return results;

	function sub_graph_coloring(i) {
		for(let colorId = 0; colorId < number_of_colors; colorId++) {
			if(isPromising(i, colorId)) {
				color_of_vertex[i] = colorId;
				if(i === n-1) {
					results.push(color_of_vertex.slice());
					continue;
				}
				sub_graph_coloring(i+1);
			}
		}
	}

	function isPromising(i, colorId) {
		return [...Array(i)].every(
			(_, j) => !(adj_matrix[i][j] && color_of_vertex[j] === colorId)
		);
	}
}

function test() {
	let adj_matrix = [
		[false, true, true, true],
		[true, false, true, false],
		[true, true, false, true],
		[true, false, true, false],
	];
	let number_of_colors = 3;
	let expected_results_length = 6;

	let results = graph_coloring(adj_matrix, number_of_colors);

	assert.strictEqual(results.length, expected_results_lengthp);
}

test();
