const assert = require('assert');
const PriorityQueue = require('../util/FastPriorityQueue');

// algorithm to solve the traveling salesman problem
// (backtracking, best first search, branch and bound)
function traveling_salesman(adj_matrix) {
	let n = adj_matrix.length;

	let current_best_length = +Infinity;		// upper bound
	let best_node = { path: null };

	let processingQueue = new PriorityQueue(
		// elements having a lower lower_bound have higher priority
		(a, b) => a.lower_bound < b.lower_bound
	);

	const FIRST_VERTEX = 0;

	let root_node = {
		level: 0,
		added_vertex: FIRST_VERTEX,
		path: [FIRST_VERTEX],
		accumulated_length: 0,
		lower_bound: undefined,		// need to be calculated after
		remain_row: new Set([...Array(n)].map((_, i) => i)),		// all row
		remain_column: new Set([...Array(n)].map((_, j) => j)),		// all column
		children: [],
	};
	root_node.lower_bound = calcLowerBound(root_node);

	processingQueue.add(root_node);

	while(!processingQueue.isEmpty()) {
		let current_node = processingQueue.poll();	// take a node that has the lowest lower_bound

		if(!isPromising(current_node))		// current_best_length may decrease, check again
			continue;

		if(current_node.path.length === n) {	// if we have reached all vertexes
			let last_step = adj_matrix[current_node.added_vertex][FIRST_VERTEX];
			if(last_step !== +Infinity) {	// the tour is finished if we can go back to FIRST_VERTEX
				let tour_length = current_node.accumulated_length + last_step;
				if(tour_length < current_best_length) {
					best_node = current_node;
					current_best_length = tour_length;
				}
			}
			continue;	// end this node
		}

		// try going from current last vertex i to all available next vertexes j
		let i = current_node.added_vertex;
		for(let j of current_node.remain_column) {
			if(adj_matrix[i][j] === +Infinity)	// skip if edge i -> j is unreachable
				continue;
			if(current_node.path.includes(j))	// we can't go back to the vertexes we have visited
				continue;

			let next_node = nodeTo(current_node, j);

			if(isPromising(next_node)) {
				current_node.children.push(next_node);
				processingQueue.add(next_node);
			}
		}
	}

	// traverseTree(root_node);

	return {
		min_distance: current_best_length,
		shortest_path: best_node.path,
	};

	function isPromising(node) {
		return node.lower_bound < current_best_length;
	}

	function calcLowerBound(node) {
		let row_min = [...Array(n)].map((_, i) => (node.remain_row.has(i) ? +Infinity : 0));
		// let col_min = [...Array(n)].map((_, j) => (node.remain_column.has(j) ? +Infinity : 0));
		for(let i of node.remain_row) {
			for(let j of node.remain_column) {
				let e = adj_matrix[i][j];
				row_min[i] = Math.min(row_min[i], e);
				// col_min[j] = Math.min(col_min[i], e);
			}
		}

		// a lower bound function, which lower_bound(node) <= actual_length(node)
		return (
			node.accumulated_length +
			row_min.reduce((a, b) => a + b, 0)
		);
		// or:
		// return (
		// 	node.accumulated_length +
		// 	col_min.reduce((a, b) => a + b, 0)
		// );
	}

	function nodeTo(previous_node, j) {
		let i = previous_node.added_vertex;
		let node = {
			level: previous_node.level + 1,
			added_vertex: j,
			path: previous_node.path.concat(j),
			accumulated_length: previous_node.accumulated_length + adj_matrix[i][j],
			lower_bound: undefined,
			remain_row: new Set(previous_node.remain_row),
			remain_column: new Set(previous_node.remain_column),
			children: [],
		};
		node.remain_row.delete(i);		// remove row i (edges from i)
		node.remain_column.delete(j);	// remove column j (edges to j)
		node.lower_bound = calcLowerBound(node);

		return node;
	}

	function traverseTree(node) {
		console.log(
			'\t'.repeat(node.level) + node.added_vertex,
			'lb:'+node.lower_bound,
		);
		for(let child_node of node.children)
			traverseTree(child_node);
	}
}

module.exports = { traveling_salesman };
function test() {
	{
		let adj_matrix = [
			[Infinity, 14, 4, 10, 20],
			[14, Infinity, 7, 8, 7],
			[4, 5, Infinity, 7, 16],
			[11, 7, 9, Infinity, 2],
			[18, 7, 17, 4, Infinity],
		];

		let expected_result = {
			min_distance: 30,
			shortest_path: [0, 3, 4, 1, 2],
		};

		let result = traveling_salesman(adj_matrix);

		console.log('min distance:', result.min_distance);
		console.log('path:', result.shortest_path);

		assert.strictEqual(result.min_distance, expected_result.min_distance);
		assert.deepStrictEqual(result.shortest_path, expected_result.shortest_path);
	}

	{
		let adj_matrix = [
			[Infinity, 3, 93, 13, 33, 9, 57],
			[4, Infinity, 77, 42, 21, 16, 34],
			[45, 17, Infinity, 36, 16, 28, 25],
			[39, 90, 80, Infinity, 56, 7, 91],
			[28, 46, 88, 33, Infinity, 25, 57],
			[3, 88, 18, 46, 92, Infinity, 7],
			[44, 26, 33, 27, 84, 39, Infinity],
		];

		let expected_result = {
			min_distance: 126,
			shortest_path: [0, 3, 5, 6, 2, 4, 1],
		};

		let result = traveling_salesman(adj_matrix);

		console.log('min distance:', result.min_distance);
		console.log('path:', result.shortest_path);

		assert.strictEqual(result.min_distance, expected_result.min_distance);
		assert.deepStrictEqual(result.shortest_path, expected_result.shortest_path);
	}
}

test();
