const defaultCompareFunction = (a, b) => (a < b ? -1 : a > b ? +1 : 0);

// unstable
function exchange_sort(data, compare = defaultCompareFunction) {
	let n = data.length;

	for(let i = 0; i < n; i++)
		for(let j = i+1; j < n; j++)
			if(compare(data[j], data[i]) < 0)
				[data[i], data[j]] = [data[j], data[i]];
}

module.exports = { exchange_sort };
