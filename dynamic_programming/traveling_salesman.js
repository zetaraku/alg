// The generic algorithm to solve the traveling salesman problem
// Time complexity: O(n^2 2^n), where n = number of nodes
// Space complexity: O(n 2^n)
function traveling_salesman_generic(adj_matrix, {
	/*
		dp_distance_to_0[i][S] =
			shortest distance from node i to node 0 using all nodes in S as intermediate nodes once
	*/
		dp_distance_to_0,
	/*
		dp_nextnode_to_0[i][S] =
			the next node of the shortest path if we're at i and want to go to 0
			using all nodes in S as intermediate nodes once
	*/
		dp_nextnode_to_0,
	/* generic functions */
		set__of,
		set_minus,
		set_inverse,
		set_isEmpty,
		set_enumerate,
		set_chooseN,
}) {
	let n = adj_matrix.length;

	for(let setSize = 1; setSize <= n-1; setSize++) {
		for(let A of set_chooseN(set_inverse(set__of(0)), setSize)) {
			for(let i of set_enumerate(set_inverse(A))) {
				dp_distance_to_0[i][A] = +Infinity;
				for(let j of set_enumerate(A)) {
					let distance = adj_matrix[i][j] + dp_distance_to_0[j][set_minus(A, set__of(j))];
					if(distance < dp_distance_to_0[i][A]) {
						dp_distance_to_0[i][A] = distance;
						dp_nextnode_to_0[i][A] = j;
					}
				}
			}
		}
	}

	return {
		min_distance: dp_distance_to_0[0][set_inverse(set__of(0))],
		shortest_path: reconstructPath(dp_nextnode_to_0),
		distance_matrix: dp_distance_to_0,
		nextnode_matrix: dp_nextnode_to_0,
	};

	function reconstructPath(nextnode_matrix) {
		let i = 0, S = set_inverse(set__of(0));

		let _path = [0];
		while(!set_isEmpty(S)) {
			i = nextnode_matrix[i][S];
			S = set_minus(S, set__of(i));
			_path.push(i);
		}

		return _path;
	}
}

// use integer as key, the max size is limited to 30.
function traveling_salesman_1(adj_matrix) {
	let n = adj_matrix.length;

	/*
		In JavaScript, array indexes are unsigned 32-bit integers (0 ~ 2^32-1),
		but the results of bitwise operators are signed 32-bit integers (-2^31 ~ 2^31-1).
		And because (1 << 31) == -2147483648, to avoid integer overflow, we demand n <= 30
	*/
	if(n > 30)
		throw new Error('Max node number exceeded. (max: 30)');

	const EMPTY_SET = 0;
	const ALL_NODES = (1 << n) - 1;

	/*
		the S of dp_distance_to_0[i][S] is a set in bitmask representation
		which k-th bit is corresponding to k-th node
	*/
	let dp_distance_to_0 = [...Array(n)].map((_, i) => {
		let arr = Array(2**n);
		arr[EMPTY_SET] = adj_matrix[i][0];
		return arr;
	});
	let dp_nextnode_to_0 = [...Array(n)].map(() => Array(2**n));

	return traveling_salesman_generic(adj_matrix, {
		dp_distance_to_0,
		dp_nextnode_to_0,
		set__of,
		set_minus,
		set_inverse,
		set_isEmpty,
		set_enumerate,
		set_chooseN,
	});

	function set__of(nth) {
		return (1 << nth);
	}
	function set_minus(S, S2) {
		return (S & ~S2);
	}
	function set_inverse(S) {
		return (~S & ALL_NODES);
	}
	function set_isEmpty(S) {
		return (S === 0);
	}
	function* set_enumerate(S) {
		let k = 0;
		while(!set_isEmpty(S)) {
			if((S & 1) !== 0)
				yield k;
			S >>>= 1; k++;
		}
	}
	function* set_chooseN(S, k) {
		if(k === 0) {
			yield 0;
		} else if(set_isEmpty(S)) {
			return;
		} else {
			for(let value of set_chooseN(S >>> 1, k))
				yield (value << 1) | 0;
			if((S & 1) !== 0) {
				for(let value of set_chooseN(S >>> 1, k-1))
					yield (value << 1) | 1;
			}
		}
	}
}

// use string as key so that the size can be arbitrarily large.
function traveling_salesman_2(adj_matrix) {
	let n = adj_matrix.length;

	const EMPTY_SET = '0'.repeat(n);
	const ALL_NODES = '1'.repeat(n);

	/*
		the S of dp_distance_to_0[i][S] is a set in STRING bitmask representation
		which k-th CHAR ('0'/'1') is corresponding to k-th node
	*/
	let dp_distance_to_0 = [...Array(n)].map((_, i) => ({ [EMPTY_SET]: adj_matrix[i][0] }));
	let dp_nextnode_to_0 = [...Array(n)].map(() => ({}));

	return traveling_salesman_generic(adj_matrix, {
		dp_distance_to_0,
		dp_nextnode_to_0,
		set__of,
		set_minus,
		set_inverse,
		set_isEmpty,
		set_enumerate,
		set_chooseN,
	});

	function set__of(nth) {
		return '0'.repeat(nth) + '1' + '0'.repeat(n - nth - 1);
	}
	function set_minus(S, S2) {
		return S.replace(/[01]/g, (m0, offset) => (S2.charAt(offset) === '1' ? '0' : m0));
	}
	function set_inverse(S) {
		return S.replace(/[01]/g, (m0) => (m0 === '0' ? '1' : '0'));
	}
	function set_isEmpty(S) {
		return !S.includes('1');
	}
	function* set_enumerate(S) {
		for(let k = 0; k < S.length; k++) {
			if(S.charAt(k) === '1')
				yield k;
		}
	}
	function* set_chooseN(S, k) {
		if(k === 0) {
			yield '0'.repeat(S.length);
		} else if(set_isEmpty(S)) {
			return;
		} else {
			for(let value of set_chooseN(S.slice(1), k))
				yield '0' + value;
			if(S.charAt(0) === '1') {
				for(let value of set_chooseN(S.slice(1), k-1))
					yield '1' + value;
			}
		}
	}
}

module.exports = {
	traveling_salesman_1,
	traveling_salesman_2,
};
