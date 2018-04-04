const assert = require('assert');

function debugMsg(msg) {
	// console.log(msg);
}

class BTree {
	constructor() {
		this.root = new BTreeNode();
	}
	static from(data) {
		let tree = new BTree();
		tree.root = BTreeNode.from(data);
		return tree;	// the result may not be a legal BTree
	}
	search(key) {
		assert(key !== undefined);
		return this.root.search(key);
	}
	insert(key) {
		assert(key !== undefined);
		if(this.root.isFull()) {
			let newRoot = new BTreeNode();
			newRoot.children = [this.root];
			this.root = newRoot;
			this.root.split_child(0);
		}
		this.root.insert_notfull(key);
	}
	delete(key) {
		assert(key !== undefined);
		let delete_result = this.root.delete_notlack(key, true);
		if(!this.root.isLeaf() && this.root.keys.length == 0)
			this.root = this.root.children[0];
		return delete_result;
	}
	toString() {
		return this.root.toString();
	}
} {
	BTree.factor = 3;
}

class BTreeNode {
	constructor() {
		this.keys = [];
		this.children = null;
	}
	static from(data) {
		let node = new BTreeNode();
		node.keys = data.keys;
		if(data.children !== null)
			node.children = data.children.map((child) => BTreeNode.from(child));
		return node;
	}
	search(key) {
		assert(key !== undefined);
		let [foundKeyIndex, foundChildIndex, _] = this.shallow_search(key);
		if(foundKeyIndex !== null)
			return [this, foundKeyIndex];
		else if(foundChildIndex !== null)
			return this.children[foundChildIndex].search(key);
		else
			return null;
	}
	insert_notfull(key) {
		assert(key !== undefined);
		assert(!this.isFull());
		let [_, foundChildIndex, insertIndex] = this.shallow_search_backward(key);

		if(this.isLeaf()) {
			this.keys.splice(insertIndex, 0, key);
			return true;
		} else {
			if(this.children[foundChildIndex].isFull()) {
				let inserted_median_key = this.split_child(foundChildIndex);
				if(key > inserted_median_key)
					foundChildIndex++;
			}
			return this.children[foundChildIndex].insert_notfull(key);
		}
	}
	delete_notlack(key, isRoot) {
		assert(key !== undefined);
		assert(isRoot || !this.isLack());
		let [foundKeyIndex, foundChildIndex, _] = this.shallow_search(key);
		if(foundKeyIndex !== null) {
			let i = foundKeyIndex;
			if(this.isLeaf()) {					// (1)
				debugMsg('(1)');
				this.keys.splice(i, 1);
			} else {							// (2)
				let [leftChild, rightChild] = this.children.slice(i, i+2);
				if(!leftChild.isLack()) {			// (2a)
					debugMsg('(2a)');
					this.keys[i] = leftChild.take_largest();
				} else if(!rightChild.isLack()) {	// (2b)
					debugMsg('(2b)');
					this.keys[i] = rightChild.take_smallest();
				} else {							// (2c) leftChild.isLack() && rightChild.isLack()
					debugMsg('(2c)');
					this.merge_childs_around(i).delete_notlack(key);
				}
			}
			return true;
		} else if(foundChildIndex !== null) {	// (3)
			let i = foundChildIndex;
			if(this.children[i].isLack()) {
				let [leftChild, rightChild] = this.children.slice(i, i+2);
				if(!leftChild.isLack()) {			// (3a)
					debugMsg('(3a)');
					this.rotate_key_clockwise(i-1);
				} else if(!rightChild.isLack()) {	// (3b)
					debugMsg('(3b)');
					this.rotate_key_counterclockwise(i);
				} else {							// (3c) leftChild.isLack() && rightChild.isLack()
					debugMsg('(3c)');
					this.merge_childs_around(i);
				}
			}
			return this.children[i].delete_notlack(key);
		} else {								// (4)
			debugMsg('(4)');
			return false;
		}
	}
	shallow_search(key) {
		assert(key !== undefined);
		for(let i = 0; true; i++) {
			let k = this.keys[i];
			if(i < this.keys.length) {
				if(key > k)
					continue;
				else if(key == k)				// (1) key found in the current node, return
					return [i, i, i];
				else	// key < k
					/* pass through */;
			} else {	// i == this.keys.length
				/* pass through */;
			}
												// (2) key not found in the current node:
			if(!this.isLeaf())
				return [null, i, i];				// (2a) give a possible child to search
			else
				return [null, null, i];				// (2b) only give a proper index to insert
		}
	}
	shallow_search_backward(key) {
		assert(key !== undefined);
		for(let i = this.keys.length; true; i--) {
			let k = this.keys[i-1];
			if(i > 0) {
				if(key < k)
					continue;
				else if(key == k)
					return [i-1, i, i];
				else	// key > k
					/* pass through */;
			} else {	// i == 0
				/* pass through */;
			}

			if(!this.isLeaf())
				return [null, i, i];
			else
				return [null, null, i];
		}
	}
	split_child(i) {
		assert(i !== undefined);
		let [leftChild, rightChild] = [this.children[i], new BTreeNode()];

		rightChild.keys.push(...leftChild.keys.splice(BTree.factor));
		let median_key = leftChild.keys.pop();

		if(!leftChild.isLeaf())
			rightChild.children = leftChild.children.splice(BTree.factor);

		this.keys.splice(i, 0, median_key);
		this.children.splice(i, 1, leftChild, rightChild);

		return median_key;
	}
	merge_childs_around(i) {
		assert(i !== undefined);
		let [leftChild, rightChild] = this.children.slice(i, i+2);

		let median_key = this.keys[i];
		leftChild.keys.push(median_key);
		leftChild.keys.push(...rightChild.keys.splice(0));

		if(!leftChild.isLeaf())
			leftChild.children.push(...rightChild.children.splice(0));

		this.keys.splice(i, 1);
		this.children.splice(i, 2, leftChild);

		return leftChild;
	}
	take_largest() {
		let node = this;
		while(!node.isLeaf())
			node = node.children[node.keys.length];
		let replaceKey = node.keys[node.keys.length-1];
		this.delete_notlack(replaceKey);
		return replaceKey;
	}
	take_smallest() {
		let node = this;
		while(!node.isLeaf())
			node = node.children[0];
		let replaceKey = node.keys[0];
		this.delete_notlack(replaceKey);
		return replaceKey;
	}
	rotate_key_clockwise(i) {
		assert(i !== undefined);
		let [leftChild, rightChild] = this.children.slice(i, i+2);

		rightChild.keys.push(this.keys[i]);
		this.keys[i] = leftChild.keys.pop();

		if(!leftChild.isLeaf())
			rightChild.children.unshift(leftChild.children.pop());
	}
	rotate_key_counterclockwise(i) {
		assert(i !== undefined);
		let [leftChild, rightChild] = this.children.slice(i, i+2);

		leftChild.keys.push(this.keys[i]);
		this.keys[i] = rightChild.keys.shift();

		if(!rightChild.isLeaf())
			leftChild.children.push(rightChild.children.shift());
	}
	isLeaf() {
		return this.children === null;
	}
	isFull() {
		return this.keys.length >= 2 * BTree.factor - 1;
	}
	isLack() {
		return this.keys.length <= BTree.factor - 1;
	}
	toString() {
		return JSON.stringify(this, null, '\t');
	}
}

module.exports = {
	BTree,
	BTreeNode,
};
