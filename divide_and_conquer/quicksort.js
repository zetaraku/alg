const assert = require('assert');

// Quick Sort (stable version)
function quicksort(data, compare) {
	if(compare === undefined)
		compare = (a, b) => a < b ? -1 : a > b ? +1 : 0;

	qsort(0, data.length);

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

function test() {
	let n = 20, range = 100;

	let arr = [...Array(n)].map(() => Math.floor(range * Math.random()));
	let expected_result = arr.slice();
		expected_result.sort((a, b) => a - b);

	let result = arr.slice();
		quicksort(result, (a, b) => a - b);

	console.log('before sort:', arr);
	console.log('after sort:', result);
	console.log('expected result:', expected_result);
	assert.deepStrictEqual(result, expected_result);
}

test();
