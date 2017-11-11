// unstable
function exchange_sort(arr) {
	let n = arr.length;
	for(let i = 0; i < n; i++)
		for(let j = i+1; j < n; j++)
			if(arr[j] < arr[i])
				[arr[i], arr[j]] = [arr[j], arr[i]];
}

module.exports = { exchange_sort };
