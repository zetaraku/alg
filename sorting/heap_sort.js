// unstable
function heap_sort(data) {
	let n = data.length;
	let heap_size = n;

	let parent = (index) => (Math.floor((index - 1) / 2));
	let childs = (index) => ({ left: index * 2 + 1, right: index * 2 + 2 });
	let exists = (index) => (/* index >= 0 && */ index < heap_size);

	maxHeapify();
	for(let i = n-1; i >= 0; i--)
		data[i] = extractMax();

	function maxHeapify() {
		for(let i = parent(heap_size-1); i >= 0; i--)
			siftDown(i);
	}

	function extractMax() {
		// assert heap_size > 0
		let result = data[0];
		data[0] = data[--heap_size];
		siftDown(0);
		return result;
	}

	function siftDown(index) {
		for(let i = index, j; j = i, true; i = j) {
			let { left, right } = childs(i);
			if(exists(left) && data[left] > data[j])
				j = left;
			if(exists(right) && data[right] > data[j])
				j = right;
			if(j === i)
				return;
			[data[i], data[j]] = [data[j], data[i]];
		}
	}
}

module.exports = { heap_sort };
