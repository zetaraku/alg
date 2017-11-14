// stable
function insertion_sort(data) {
	let n = data.length;

	for(let i = 0; i < n; i++) {
		let x = data[i];
		// data[i] = null;
		for(let j = i-1; true; j--) {
			if(j < 0 || data[j] <= x) {
				data[j+1] = x;
				break;
			}
			data[j+1] = data[j];
			// data[j] = null;
		}
	}
}

module.exports = { insertion_sort };
