const defaultCompareFunction = (a, b) => (a < b ? -1 : a > b ? +1 : 0);

// unstable
function selection_sort(data, compare = defaultCompareFunction) {
	let n = data.length;

	for(let i = 0; i < n; i++) {
		let iMin = i;
		for(let j = i+1; j < n; j++) {
			if(compare(data[j], data[iMin]) < 0)
				iMin = j;
		}
		[data[i], data[iMin]] = [data[iMin], data[i]];
	}
}

module.exports = { selection_sort };
