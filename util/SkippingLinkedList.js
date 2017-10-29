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

module.exports = SkippingLinkedList;
