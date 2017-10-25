const assert = require('assert');

/*
	A special implement of linked list
	which can temporarily remove the iterating item when iterating
*/
class Node {
	constructor(data) {
		this.data = data;
		this.next = null;
	}
}
class SkippingLinkedList {
	constructor(datas) {
		this.primer = new Node();
		let cur = this.primer;
		for(let data of datas) {
			cur.next = new Node(data);
			cur = cur.next;
		}
	}
	* [Symbol.iterator]() {
		for(let n = this.primer; n.next !== null; n = n.next) {
			let t = n.next;
			n.next = t.next;	// temporarily remove the returning node
			yield t.data;
			n.next = t;			// put it back afterward
		}
	}
}

// algorithm to find the solutions of the 'eight queens puzzle'
function n_queens(n) {
	let all_pos = [...Array(n)].map((_, i) => i);
	let available_cols = new SkippingLinkedList(all_pos);

	let path_stack = [];
	let results = [];

	sub_queen();

	return results;

	function sub_queen() {
		/*
			Since a queen occupied a row and a column,
			each row and column will be occupied by one queen exactly once.
			To avoid same combination with different permutation,
			we can choose to start occupying from first row to last row one at a time.
			So that the positions of result can only be like:
			[0, c0], [1, c1], [2, c2], [3, c3], ...
			but no the same combination with different permutation:
			[1, c1], [0, c0], [3, c2], [2, c3], ...
			because we require the choices of rows should be in increasing order.
		*/
		let row = path_stack.length;

		for(let col of available_cols) {
			if(path_stack.some(([r, c]) => Math.abs(row - r) === Math.abs(col - c)))
				continue;		// backtrack if any diagonal attacks exist

			path_stack.push([row, col]);	// place a queen at (row, col)
			if(path_stack.length === n) {	// found a solution
				results.push(path_stack.slice());
			} else {
				sub_queen();
			}
			path_stack.pop();
		}
	}
}

// rewrite from a Pascal program by Niklaus Wirth in 1976
// https://en.wikipedia.org/wiki/Eight_queens_puzzle#Sample_program
function n_queens_1976(n) {
	let V = [...Array(n)].fill(true);		// vertical-line 0~(n-1)
	let A = [...Array(2*n-1)].fill(true);	// diagonal-ascending-line, 0~2(n-1)
	let F = [...Array(2*n-1)].fill(true);	// diagonal-falling-line, -(n-1)~+(n-1), offset by +(n-1)

	let path_array = [...Array(n)];
	let results = [];

	sub_queen(0);

	return results;

	function sub_queen(i) {
		for(let j = 0; j <= n; j++) {
			if(V[j] && A[i+j] && F[i-j+(n-1)]) {	// if no any attacks
				path_array[i] = j;	// place a queen at (row i, column j)
				if(i === n-1) {		// found a solution
					results.push(path_array.map((col, row) => [row, col]));
				} else {
					V[j] = A[i+j] = F[i-j+(n-1)] = false;
					sub_queen(i+1);
					V[j] = A[i+j] = F[i-j+(n-1)] = true;
				}
			}
		}
	}
}

function test() {
	assert.strictEqual(n_queens(5).length, 10);
	assert.strictEqual(n_queens_1976(6).length, 4);
	assert.strictEqual(n_queens(7).length, 40);
	assert.strictEqual(n_queens_1976(8).length, 92);

	assert.deepStrictEqual(n_queens(7), n_queens_1976(7));
}

test();
