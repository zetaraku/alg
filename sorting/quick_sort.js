const defaultCompareFunction = (a, b) => (a < b ? -1 : a > b ? +1 : 0);

// unstable
function quick_sort(data, compare = defaultCompareFunction) {
	let n = data.length;

	qsort(0, n-1);

	function qsort(from, to) {
		if(to - from + 1 < 2)
			return;
		let pivot_index = partition(from, to);
		qsort(from, pivot_index - 1);
		qsort(pivot_index + 1, to);
	}

	function partition(from, to) {	// [from, to] should be non-empty
		let pivot_index = selectPivotIndex(from, to);
		let pivot = data[pivot_index];

		let j = from - 1 /* right wall */;

		[data[from], data[pivot_index]] = [data[pivot_index], data[from]];
		for(let i = from; i <= to; i++) {
			if(compare(data[i], pivot) <= 0) {
				j++;
				[data[i], data[j]] = [data[j], data[i]];
			}
		}
		[data[from], data[j]] = [data[j], data[from]];

		return j;
	}

	function selectPivotIndex(from, to) {
		return from + Math.floor((to - from + 1) * Math.random());
	}
}

// stable version
function quick_sort_stable(data, compare = defaultCompareFunction) {
	let n = data.length;

	qsort(0, n);

	function qsort(begin, end) {
		if(end - begin < 2)
			return;
		let [pivot_begin, pivot_end] = partition(begin, end);
		qsort(begin, pivot_begin);
		qsort(pivot_end, end);
	}

	function partition(begin, end) {
		let pivot = data[selectPivotIndex(begin, end)];

		let less = [], equal = [], greater = [];
		for(let i = begin; i < end; i++) {
			let compare_result = compare(data[i], pivot);
			if(compare_result < 0) {
				less.push(data[i]);
			} else if(compare_result > 0) {
				greater.push(data[i]);
			} else {
				equal.push(data[i]);
			}
		}

		let k = begin;
		for(let value of less)
			data[k++] = value;
		for(let value of equal)
			data[k++] = value;
		for(let value of greater)
			data[k++] = value;

		return [begin + less.length, end - greater.length];
	}

	function selectPivotIndex(begin, end) {
		return begin + Math.floor((end - begin) * Math.random());
	}
}

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

module.exports = {
	quick_sort,
	quick_sort_stable,
	quick_sort_bidirectional,
};
