class Point2D {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
	static add(pA, pB) {
		return new Point2D(pA.x+pB.x, pA.y+pB.y);
	}
	static sub(pA, pB) {
		return new Point2D(pA.x-pB.x, pA.y-pB.y);
	}
	static determinant(pA, pB) {
		return pA.x * pB.y - pA.y * pB.x;
	}
}

module.exports = Point2D;
