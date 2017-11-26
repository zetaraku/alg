const defaultGetKeyFunction = (e) => (e);

// stable, keys should be in signed 32-bit integers
function binary_radix_sort_lsd(data, getKey = defaultGetKeyFunction) {
	let n = data.length;

	let [data_ptr, buffer_ptr] = [data, Array(n)];

	let data_i = n, data_j = n-1
	for(let mask = 1; mask !== 0; mask <<= 1) {
		let buffer_i = 0, buffer_j = n-1;

		// 0: [0 -----> data_i)
		for(let i = 0; i < data_i; i++) {
			let num = getKey(data_ptr[i]);
			if(num & mask)
				buffer_ptr[buffer_j--] = data_ptr[i];
			else
				buffer_ptr[buffer_i++] = data_ptr[i];
		}
		// 1: (data_j <----- (n-1)]
		for(let j = n-1; j > data_j; j--) {
			let num = getKey(data_ptr[j]);
			if(num & mask)
				buffer_ptr[buffer_j--] = data_ptr[j];
			else
				buffer_ptr[buffer_i++] = data_ptr[j];
		}

		[data_ptr, buffer_ptr] = [buffer_ptr, data_ptr];
		[data_i, data_j] = [buffer_i, buffer_j];
	}

	// final rearrange (sign: + > -)
	{
		let buffer_i = 0;
		for(let j = n-1; j > data_j; j--)
			buffer_ptr[buffer_i++] = data_ptr[j];
		for(let i = 0; i < data_i; i++)
			buffer_ptr[buffer_i++] = data_ptr[i];

		data_ptr = buffer_ptr;
	}

	// if the current result array is not the array passed in, we copy the values from result to it
	if(data_ptr !== data) {
		for(let t = 0; t < n; t++)
			data[t] = data_ptr[t];
	}
}

// stable, keys should be in signed 32-bit integers
function binary_radix_sort_msd(data, getKey = defaultGetKeyFunction) {
	let n = data.length;

	let buffer = Array(n);

	let inverse = 1 << 31;	// treat the sign bit inversed
	rsort(0, n-1, 1 << 31);

	function rsort(from, to, mask) {
		if(to - from + 1 <= 1 || mask === 0)
			return;

		let buffer_i = from, buffer_j = to;

		// classify by mask
		for(let i = from; i <= to; i++) {
			let num = getKey(data[i]);
			if((num ^ inverse) & mask)
				buffer[buffer_j--] = data[i];	// 1: put to right buffer
			else
				buffer[buffer_i++] = data[i];	// 0: put to left buffer
		}

		// copy back from the buffer (rearranged)
		let data_t = from;
		for(let i = from; i < buffer_i; i++)
			data[data_t++] = buffer[i];
		for(let j = to; j > buffer_j; j--)
			data[data_t++] = buffer[j];

		// sort by the next bit (use unsigned right shift (>>>) !)
		rsort(from, buffer_j, mask >>> 1);
		rsort(buffer_i, to, mask >>> 1);
	}
}

module.exports = {
	binary_radix_sort_lsd,
	binary_radix_sort_msd,
};
