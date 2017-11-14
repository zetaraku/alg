// Quick Sort (unstable version)
function quick_sort_bidirectional(data) {

	qsort(0, data.length);

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
			while(i < end && data[i] <= pivot)
				i++;
			while(/* j >= begin && */ data[j] > pivot)
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
