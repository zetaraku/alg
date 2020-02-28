function createNDimArray([firstDim, ...restDims], defaultValue) {
	if(firstDim === undefined) {
		return undefined;
	} else if(restDims.length === 0) {
		return Array(firstDim).fill(defaultValue);
	} else {
		return [...Array(firstDim)].map(
			() => createNDimArray([...restDims], defaultValue)
		);
	}
}

function copyNDimArray(nDimArray) {
	if(nDimArray instanceof Array) {
		return nDimArray.map(e => copyNDimArray(e));
	} else {
		return nDimArray;
	}
}

module.exports = {
	createNDimArray,
	copyNDimArray,
};
