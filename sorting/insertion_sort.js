// stable
function insertion_sort(arr) {
	let n = arr.length;
	for(let i = 0; i < n; i++) {
		let x = arr[i];
		// arr[i] = null;
		for(let j = i-1; true; j--) {
			if(j < 0 || arr[j] <= x) {
				arr[j+1] = x;
				break;
			}
			arr[j+1] = arr[j];
			// arr[j] = null;
		}
	}
}

module.exports = { insertion_sort };
