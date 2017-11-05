// generalized Monte Carlo Algorithm for estimating backtracking algorithms
function monte_carlo_alg({ root_node, getChildren, isPromising, afterChosen }) {
	let current_node = root_node;
	let total_estimated_nodes = 1;
	let last_mprod = 1;

	while(true) {
		let children = getChildren(current_node);
		total_estimated_nodes += last_mprod * children.length;

		let promising_children = children.filter(isPromising);
		last_mprod *= promising_children.length;

		if(promising_children.length === 0)
			break;

		current_node = promising_children[Math.floor(Math.random() * promising_children.length)];
		afterChosen(current_node);
	}

	return total_estimated_nodes;
}

// an instance of Monte Carlo Algorithm of n_queens_1976 (in file n_queens.js)
function n_queens_1976_estimated(n) {
	let V = [...Array(n)].fill(true);		// vertical-line [L: j = c], c = 0~(n-1)
	let A = [...Array(2*n-1)].fill(true);	// diagonal-ascending-line [L: i+j = c], c = 0~2(n-1)
	let F = [...Array(2*n-1)].fill(true);	// diagonal-falling-line [L: i-j = c], c = -(n-1)~+(n-1), offset by +(n-1)

	return monte_carlo_alg({
		root_node: [-1, null],
		getChildren: ([i, j]) => [...Array(n)].map((_, jj) => [i+1, jj]),
		isPromising: ([i, j]) => V[j] && A[i+j] && F[i-j+(n-1)],
		afterChosen: ([i, j]) => {
			V[j] = A[i+j] = F[i-j+(n-1)] = false;
		},
	});
}

module.exports = { monte_carlo_alg, n_queens_1976_estimated };
function test() {
	let N = 20;
	let n = 8;
	let estimated_nodes = 0;
	for(let i = 0; i < N; i++) {
		estimated_nodes += n_queens_1976_estimated(n);
	}
	console.log(estimated_nodes / N);	// ~16450, actual: 17694
}

test();
