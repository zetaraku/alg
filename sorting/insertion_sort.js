const defaultCompareFunction = (a, b) => (a < b ? -1 : a > b ? +1 : 0);

// stable
function insertion_sort(data, compare = defaultCompareFunction) {
	let n = data.length;

	for(let i = 0; i < n; i++) {
		let x = data[i];
		// data[i] = null;
		for(let j = i-1; true; j--) {
			if(j < 0 || compare(data[j], x) <= 0) {
				data[j+1] = x;
				break;
			}
			data[j+1] = data[j];
			// data[j] = null;
		}
	}
}

module.exports = { insertion_sort };
