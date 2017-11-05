const assert = require('assert');
const { createNDimArray } = require('../util/ndim_arr');

const FROM_UPLEFT = 0, FROM_UP = 1, FROM_LEFT = 2;

// algorithm to solve the sequence alignment problem
// Time complexity: O(mn), where m = length of string 1, W = length of string 2
// Space complexity: O(mn)
function sequence_alignment(s1, s2, { unmatch_penalty = 1, gap_penalty = 2 } = {}) {
	let m = s1.length, n = s2.length;

	/*
		dp_cost[i][j] =
			the min cost of the alignment of s1[0..i-1] and s2[0..j-1]
	*/
	let dp_cost = createNDimArray([m+1, n+1]);

	/*
		dp_choose[i][j] =
			the chosen direction which produces the dp_cost[i][j]
		FROM_UPLEFT = 0, FROM_UP = 1, FROM_LEFT = 2
	*/
	let dp_choose = createNDimArray([m+1, n+1]);

	{
		dp_cost[0][0] = 0;
		dp_choose[0][0] = undefined;
	}
	for(let i = 1; i <= m; i++) {
		dp_cost[i][0] = i * gap_penalty;
		dp_choose[i][0] = FROM_UP;
	}
	for(let j = 1; j <= n; j++) {
		dp_cost[0][j] = j * gap_penalty;
		dp_choose[0][j] = FROM_LEFT;
	}

	for(let i = 1; i <= m; i++) {
		for(let j = 1; j <= n; j++) {
			/*
				Alignment of s1[0..i] and s2[0..j] may be:
				(0) FROM_UPLEFT
					s1[0..i-1] | s1[i]
					s2[0..j-1] | s2[j]
					Alignment cost = Alignment cost of s1[0..i-1] and s2[0..j-1] + unmatch_penalty?
				(1) FROM_UP
					s1[0..i-1] | s1[i]
					s2[0..j  ] | -----
					Alignment cost = Alignment cost of s1[0..i-1] and s2[0..j  ] + gap_penalty
				(2) FROM_LEFT
					s1[0..i  ] | -----
					s2[0..j-1] | s2[j]
					Alignment cost = Alignment cost of s1[0..i  ] and s2[0..j-1] + gap_penalty
			*/
			let subs = [
				dp_cost[i-1][j-1] + (s1[(-1)+i] === s2[(-1)+j] ? 0 : unmatch_penalty),
				dp_cost[i-1][j  ] + gap_penalty,
				dp_cost[i  ][j-1] + gap_penalty,
			];
			dp_cost[i][j] = Math.min(...subs);
			dp_choose[i][j] = subs.indexOf(dp_cost[i][j]);
		}
	}

	return { cost_matrix: dp_cost, choose_matrix: dp_choose };
}

function reconstructPath(s1, s2, choose_matrix) {
	let a1 = [], a2 = [];

	let i = s1.length, j = s2.length;
	while(i !== 0 && j !== 0) {
		if(choose_matrix[i][j] === 0) {
			a1.unshift(s1[(-1)+i--]);
			a2.unshift(s2[(-1)+j--]);
		} else if(choose_matrix[i][j] === 1) {
			a1.unshift(s1[(-1)+i--]);
			a2.unshift(null);
		} else if(choose_matrix[i][j] === 2) {
			a1.unshift(null);
			a2.unshift(s2[(-1)+j--]);
		}
	}

	return { s1: a1, s2: a2 };
}

module.exports = { sequence_alignment, reconstructPath };
function test() {
	let s1 = 'AACAGTTACC', s2 = 'TAAGGTCA';
	let m = s1.length, n = s2.length;

	let expected_result = {
		min_cost: 7,
	};

	let result = sequence_alignment(s1, s2, { unmatch_penalty: 1, gap_penalty: 2 });

	let min_cost = result.cost_matrix[m][n];
	console.log('min cost:', min_cost);

	let alignment = reconstructPath(s1, s2, result.choose_matrix);
	console.log('alignment:');
	console.log('\t', alignment.s1);
	console.log('\t', alignment.s2);

	assert.strictEqual(min_cost, expected_result.min_cost);
}

test();
