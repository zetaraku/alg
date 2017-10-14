class DisjointSet {
	constructor(n) {
		this.nodes = Array(n);
		for(let i = 0; i < n; i++)
			this.nodes[i] = {
				parentId: i,
				rank: 0,
			};
	}
	find(i) {	// TODO: path compression
		let j = i;
		while(j !== this.nodes[j].parentId)
			j = this.nodes[j].parentId;
		return j;
	}
	merge(p, q) {
		if(this.nodes[p].rank < this.nodes[q].rank) {
			this.nodes[p].parentId = q;
		} else if(this.nodes[q].rank < this.nodes[p].rank) {
			this.nodes[q].parentId = p;
		} else {	// this.nodes[p].rank == this.nodes[q].rank
			this.nodes[q].parentId = p;
			this.nodes[p].rank++;
		}
	}
}

module.exports = DisjointSet;
