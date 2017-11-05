const { createNDimArray } = require('../util/ndim_arr');

// algorithm to solve the traveling salesman problem
// Time complexity: O(n^2 2^n), where n = number of nodes
// Space complexity: O(n 2^n)
function traveling_salesman_1(adj_matrix) {
	let n = adj_matrix.length;

	/*
		In JavaScript, array indexes are unsigned 32-bit integers (0 ~ 2^32-1),
		but the results of bitwise operators are signed 32-bit integers (-2^31 ~ 2^31-1).
		And because (1 << 31) == -2147483648, to avoid integer overflow, we demand n <= 30
	*/
	if(n > 30)
		throw new Error('Max node number exceeded. (max: 30)');

	/*
		dp_distance_to_0[i][S] =
			shortest distance from node i to node 0 using all nodes in S as intermediate nodes once
		S is a set in bitmask representation which k-th bit is corresponding to k-th node
	*/
	let dp_distance_to_0 = createNDimArray([n, 2**n]);

	/*
		dp_nextnode_to_0[i][S] =
			the next node of the shortest path if we're at i and want to go to 0
			using all nodes in S as intermediate nodes once
	*/
	let dp_nextnode_to_0 = createNDimArray([n, 2**n]);

	const EMPTY_SET = 0;
	const ALL_NODES = (1 << n) - 1;

	for(let i = 0; i < n; i++)
		dp_distance_to_0[i][EMPTY_SET] = adj_matrix[i][0];

	for(let setSize = 1; setSize <= n-1; setSize++) {
		for(let A of chooseFromSet(bitwise_minus(ALL_NODES, 0), setSize)) {
			for(let i of enumerate_bitset(bitwise_not(A))) {
				dp_distance_to_0[i][A] = +Infinity;
				for(let j of enumerate_bitset(A)) {
					let distance = adj_matrix[i][j] + dp_distance_to_0[j][bitwise_minus(A, j)];
					if(distance < dp_distance_to_0[i][A]) {
						dp_distance_to_0[i][A] = distance;
						dp_nextnode_to_0[i][A] = j;
					}
				}
			}
		}
	}

	return {
		min_distance: dp_distance_to_0[0][bitwise_minus(ALL_NODES, 0)],
		shortest_path: reconstructPath(dp_nextnode_to_0, ALL_NODES),
		distance_matrix: dp_distance_to_0,
		nextnode_matrix: dp_nextnode_to_0,
	};

	function reconstructPath(nextnode_matrix, all_nodes) {
		let i = 0, S = bitwise_minus(all_nodes, 0);

		let _path = [0];
		while(S !== 0) {
			i = nextnode_matrix[i][S];
			S = bitwise_minus(S, i);
			_path.push(i);
		}

		return _path;
	}

	function* chooseFromSet(S, k) {
		if(k === 0) {
			yield 0;
		} else if(S === 0) {
			return;
		} else {
			for(let value of chooseFromSet(S >>> 1, k))
				yield (value << 1) | 0;
			if((S & 1) !== 0) {
				for(let value of chooseFromSet(S >>> 1, k-1))
					yield (value << 1) | 1;
			}
		}
	}
	function* enumerate_bitset(S) {
		let k = 0;
		while(S !== 0) {
			if((S & 1) !== 0)
				yield k;
			S >>>= 1; k++;
		}
	}
	function bitwise_minus(S, nth) {
		return (S & ~(1 << nth));
	}
	function bitwise_not(S) {
		return (~S & ALL_NODES);
	}
}

// traveling_salesman_1 & Use string instead of integer as key
// so that the size can be arbitrarily large.
function traveling_salesman_2(adj_matrix) {
	let n = adj_matrix.length;

	/*
		dp_distance_to_0[i][S] =
			shortest distance from node i to node 0 using all nodes in S as intermediate nodes once
		S is a set in STRING bitmask representation which k-th CHAR ('0'/'1') is corresponding to k-th node
	*/
	let dp_distance_to_0 = createNDimArray([n]);

	/*
		dp_nextnode_to_0[i][S] =
			the next node of the shortest path if we're at i and want to go to 0
			using all nodes in S as intermediate nodes once
	*/
	let dp_nextnode_to_0 = createNDimArray([n]);

	const EMPTY_SET = '0'.repeat(n);
	const ALL_NODES = '1'.repeat(n);

	for(let i = 0; i < n; i++) {
		dp_distance_to_0[i] = {};	// initialize 2nd dimension here
		dp_distance_to_0[i][EMPTY_SET] = adj_matrix[i][0];
		dp_nextnode_to_0[i] = {};	// initialize 2nd dimension here
	}

	for(let setSize = 1; setSize <= n-1; setSize++) {
		for(let A of chooseFromSet(bitwise_minus(ALL_NODES, 0), setSize)) {
			for(let i of enumerate_bitset(bitwise_not(A))) {
				dp_distance_to_0[i][A] = +Infinity;
				for(let j of enumerate_bitset(A)) {
					let distance = adj_matrix[i][j] + dp_distance_to_0[j][bitwise_minus(A, j)];
					if(distance < dp_distance_to_0[i][A]) {
						dp_distance_to_0[i][A] = distance;
						dp_nextnode_to_0[i][A] = j;
					}
				}
			}
		}
	}

	return {
		min_distance: dp_distance_to_0[0][bitwise_minus(ALL_NODES, 0)],
		shortest_path: reconstructPath(dp_nextnode_to_0, ALL_NODES),
		distance_matrix: dp_distance_to_0,
		nextnode_matrix: dp_nextnode_to_0,
	};

	function reconstructPath(nextnode_matrix, all_nodes) {
		let i = 0, S = bitwise_minus(all_nodes, 0);

		let _path = [0];
		while(S.includes('1')) {
			i = nextnode_matrix[i][S];
			S = bitwise_minus(S, i);
			_path.push(i);
		}

		return _path;
	}

	function* chooseFromSet(S, k) {
		if(k === 0) {
			yield '0'.repeat(S.length);
		} else if(!S.includes('1')) {
			return;
		} else {
			for(let value of chooseFromSet(S.slice(1), k))
				yield '0' + value;
			if(S.charAt(0) === '1') {
				for(let value of chooseFromSet(S.slice(1), k-1))
					yield '1' + value;
			}
		}
	}
	function* enumerate_bitset(S) {
		for(let k = 0; k < S.length; k++) {
			if(S.charAt(k) === '1')
				yield k;
		}
	}
	function bitwise_minus(S, nth) {
		return S.slice(0, nth) + '0' + S.slice(nth + 1);
	}
	function bitwise_not(S) {
		return S.replace(/[01]/g, (m0) => m0 === '0' ? '1' : '0');
	}
}

module.exports = {
	traveling_salesman_1,
	traveling_salesman_2,
};
