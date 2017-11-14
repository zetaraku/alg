// stable
function selection_sort(data) {
	let n = data.length;

	for(let i = 0; i < n; i++) {
		let iMin = i;
		for(let j = i+1; j < n; j++) {
			if(data[j] < data[iMin])
				iMin = j;
		}
		[data[i], data[iMin]] = [data[iMin], data[i]];
	}
}

module.exports = { selection_sort };
