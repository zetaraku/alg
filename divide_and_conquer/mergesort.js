const assert = require('assert');

// Merge Sort (stable)
function mergesort(data, compare) {
	if(compare === undefined)
		compare = (a, b) => a < b ? -1 : a > b ? +1 : 0;

	let buffer = Array(data.length);
	msort(0, data.length);

	function msort(begin, end) {
		if(end - begin < 2)
			return;
		let mid = Math.floor((begin + end) / 2);
		msort(begin, mid);
		msort(mid, end);
		merge(begin, mid, end);
	}

	function merge(begin, mid, end) {
		let i = begin, j = mid;
		let k = begin;
		while(true) {
			if(compare(data[i], data[j]) <= 0) {
				buffer[k++] = data[i++];
				if(i >= mid) {
					while(j < end)
						buffer[k++] = data[j++];
					break;
				}
			} else {
				buffer[k++] = data[j++];
				if(j >= end) {
					while(i < mid)
						buffer[k++] = data[i++];
					break;
				}
			}
		}

		for(let t = begin; t < end; t++)
			data[t] = buffer[t];
	}
}

module.exports = { mergesort };
function test() {
	let n = 20, range = 100;

	let arr = [...Array(n)].map(() => Math.floor(range * Math.random()));
	let expected_result = arr.slice();
		expected_result.sort((a, b) => a - b);

	let result = arr.slice();
		mergesort(result, (a, b) => a - b);

	console.log('before sort:', arr);
	console.log('after sort:', result);
	console.log('expected result:', expected_result);

	assert.deepStrictEqual(result, expected_result);
}

test();
