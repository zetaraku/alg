// unstable
function exchange_sort(data) {
	let n = data.length;

	for(let i = 0; i < n; i++)
		for(let j = i+1; j < n; j++)
			if(data[j] < data[i])
				[data[i], data[j]] = [data[j], data[i]];
}

module.exports = { exchange_sort };
