const assert = require('assert');

// algorithm to solve the graph coloring problem
// Worst Time Complexity: O(m^n), where m = number of colors, n = number of vertexes
function graph_coloring(adj_matrix, number_of_colors) {
	let n = adj_matrix.length;

	let color_stack_of_vertex = [];

	let results = [];

	sub_graph_coloring(0);

	return results;

	function sub_graph_coloring(i) {
		for(let colorId = 0; colorId < number_of_colors; colorId++) {
			if(isPromising(i, colorId)) {
				color_stack_of_vertex.push(colorId);

				if(color_stack_of_vertex.length === n) {
					results.push(color_stack_of_vertex.slice());
				} else {
					sub_graph_coloring(i+1);
				}

				color_stack_of_vertex.pop();
			}
		}
	}

	function isPromising(i, colorId) {
		return color_stack_of_vertex.every(
			(previousColorId, j) => !(adj_matrix[i][j] && previousColorId === colorId)
		);
	}
}

module.exports = { graph_coloring };
function test() {
	let adj_matrix = [
		[false, true, true, true],
		[true, false, true, false],
		[true, true, false, true],
		[true, false, true, false],
	];
	let number_of_colors = 3;
	let expected_results = [
		[0, 1, 2, 1],
		[0, 2, 1, 2],
		[1, 0, 2, 0],
		[1, 2, 0, 2],
		[2, 0, 1, 0],
		[2, 1, 0, 1],
	];

	let results = graph_coloring(adj_matrix, number_of_colors);

	console.log(results);

	assert.deepStrictEqual(results, expected_results);
}

test();
