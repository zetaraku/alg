const defaultCompareFunction = (a, b) => (a < b ? -1 : a > b ? +1 : 0);

// unstable
function quick_sort_bidirectional(data, compare = defaultCompareFunction) {
	let n = data.length;

	qsort(0, n);

	function qsort(begin, end) {
		if(end - begin < 2)
			return;
		let [pivot_begin, pivot_end] = partition(begin, end);
		qsort(begin, pivot_begin);
		qsort(pivot_end, end);
	}

	function partition(begin, end) {	// [begin, end) should be non-empty
		let pivot_index = selectPivotIndex(begin, end);
		let pivot = data[pivot_index];

		let i = begin /* left wall */, j = end - 1 /* right wall */;

		[data[j], data[pivot_index]] = [data[pivot_index], data[j]];
		while(i <= j) {
			[data[i], data[j]] = [data[j], data[i]];
			while(i < end && compare(data[i], pivot) <= 0)
				i++;
			while(/* j >= begin && */ compare(data[j], pivot) > 0)
				j--;
		}
		[data[begin], data[j]] = [data[j], data[begin]];

		return [j, i];
	}

	function selectPivotIndex(begin, end) {
		return begin + Math.floor((end - begin) * Math.random());
	}
}

module.exports = { quick_sort_bidirectional };
