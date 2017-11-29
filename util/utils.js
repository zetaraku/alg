function shuffleArray(arr) {
	let n = arr.length;
	for (let i = 0; i < n; i++) {
		let j = i + Math.floor(Math.random() * (n - i));
		[arr[i], arr[j]] = [arr[j], arr[i]];
	}
}

module.exports = {
	shuffleArray,
};
