// stable
function merge_sort_iterative(data) {
	let n = data.length;
	let lgm = Math.ceil(Math.log2(n));
	let m = 2 ** lgm;

	let [data_ptr, buffer_ptr] = [data, Array(n)];

	for(let k = 0; k < lgm; k++) {
		let size = 2 ** k;
		let period_count = 2 ** (lgm - k - 1);
		for(let s = 0; s < period_count; s++) {
			let begin = 0 + s * (2 * size);
			if(begin >= n) break;
			let mid = Math.min(begin + 1*size, n);
			let end = Math.min(begin + 2*size, n);
			merge(begin, mid, end);
		}
		// instead of copy the buffer back, we swap them
		[data_ptr, buffer_ptr] = [buffer_ptr, data_ptr];
	}

	// if the current result array is not the array passed in, we copy the values from result to it
	if(data_ptr !== data) {
		for(let t = 0; t < n; t++)
			data[t] = data_ptr[t];
	}

	function merge(begin, mid, end) {
		// data_ptr[i] or data_ptr[j] will be invalid if any interval is empty
		if(begin >= mid || mid >= end) {
			// if so, we simply copy the data to buffer and return
			for(let t = begin; t < end; t++)
				buffer_ptr[t] = data_ptr[t];
			return;
		}

		let i = begin, j = mid;
		let k = begin;
		while(true) {
			if(data_ptr[i] <= data_ptr[j]) {
				buffer_ptr[k++] = data_ptr[i++];
				if(i >= mid) {
					while(j < end)
						buffer_ptr[k++] = data_ptr[j++];
					break;
				}
			} else {
				buffer_ptr[k++] = data_ptr[j++];
				if(j >= end) {
					while(i < mid)
						buffer_ptr[k++] = data_ptr[i++];
					break;
				}
			}
		}
	}
}

// stable
function merge_sort_modifylink(data) {
	let n = data.length;

	let next_link = Array(n+1);		// we store the next_link in array index separately from the data
	const dummy_head = n;			// index for the dummy head

	let merged_list = merge_sort_sub(0, n);	// do the merge sort

	// retrieve the order by the links and modify the input array
	let result = Array(n);
	for(let i = 0, t = merged_list; t !== null; i++, t = next_link[t])
		result[i] = data[t];
	for(let i = 0; i < n; i++)
		data[i] = result[i];

	function merge_sort_sub(begin, end) {
		let merged_list = null;		// the head index of the merged list to return

		if(end - begin < 1) {
			merged_list = null;
		} else if(end - begin === 1) {
			next_link[begin] = null;	// initialize a single node
			merged_list = begin;
		} else {
			let mid = Math.floor((begin + end) / 2);
			let list1 = merge_sort_sub(begin, mid);
			let list2 = merge_sort_sub(mid, end);
			merged_list = merge(list1, list2);
		}

		return merged_list;
	}

	function merge(list1_head, list2_head) {
		// next_link[dummy_head] = null;
		let prev_idx = dummy_head;

		let list1_idx = list1_head, list2_idx = list2_head;
		while(list1_idx !== null && list2_idx !== null) {
			if(data[list1_idx] < data[list2_idx]) {
				prev_idx = next_link[prev_idx] = list1_idx;
				list1_idx = next_link[list1_idx];
			} else {
				prev_idx = next_link[prev_idx] = list2_idx;
				list2_idx = next_link[list2_idx];
			}
		}

		if(list1_idx !== null)
			next_link[prev_idx] = list1_idx;
		else if(list2_idx !== null)
			next_link[prev_idx] = list2_idx;
		else
			next_link[prev_idx] = null;

		return next_link[dummy_head];
	}
}

module.exports = {
	merge_sort_iterative,
	merge_sort_modifylink,
};
