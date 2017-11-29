const { insertion_sort } = require('../sorting/insertion_sort');

const defaultCompareFunction = (a, b) => (a < b ? -1 : a > b ? +1 : 0);

function selection(data, kth, compare = defaultCompareFunction) {
	let n = data.length;

	if(kth < 0 || kth >= n)
		throw new Error('out of range!');

	data = data.slice();	// prevent mutation of original data
	return sub_selection(0, n-1);

	function sub_selection(from, to) {
		if(from === to) {
			return data[from];
		} else {
			let pivot_index = partition(from, to);
			if(kth < pivot_index)
				return sub_selection(from, pivot_index-1);
			else if(kth > pivot_index)
				return sub_selection(pivot_index+1, to);
			else // kth === pivot_index
				return data[pivot_index];
		}
	}

	function partition(from, to) {
		let pivot = selectPivot(from, to);
		let pivot_index = undefined;

		let j = from - 1 /* right wall */;

		for(let i = from; i <= to; i++) {
			if(compare(data[i], pivot) <= 0) {
				j++;
				[data[i], data[j]] = [data[j], data[i]];
				if(compare(data[j], pivot) === 0)
					pivot_index = j;
			}
		}
		[data[pivot_index], data[j]] = [data[j], data[pivot_index]];

		return j;
	}

	function selectPivot(from, to) {
		let sub_n = to - from + 1;

		let medians = Array(Math.ceil(sub_n / 5));
		for(let i = 0; i < medians.length; i++) {
			medians[i] = find_median_mini(from + 5 * i, Math.min(from + 5 * (i+1), to+1));
		}

		return find_median(medians, compare);
	}

	function find_median_mini(begin, end) {
		let arr5 = data.slice(begin, end);
		insertion_sort(arr5, compare);

		return arr5[Math.floor((arr5.length-1) / 2)];
	}
}

function find_median(data, compare = defaultCompareFunction) {
	return selection(data, Math.floor((data.length-1) / 2), compare);
}

module.exports = {
	selection,
	find_median,
};
