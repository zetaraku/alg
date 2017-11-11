// stable
function selection_sort(arr) {
	let n = arr.length;
	for(let i = 0; i < n; i++) {
		let iMin = i;
		for(let j = i+1; j < n; j++) {
			if(arr[j] < arr[iMin])
				iMin = j;
		}
		[arr[i], arr[iMin]] = [arr[iMin], arr[i]];
	}
}

module.exports = { selection_sort };
