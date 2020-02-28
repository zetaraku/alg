const Point2D = require('../util/Point2D');

// algorithm to find the convex hull (counter-clockwise, start from low-left, include points on edge)
// Time complexity: O(n lg n) (from sorting)
function convex_hull_up_down(points) {
	let sorted_points = points.slice().sort((a, b) => (a.x - b.x) || (a.y - b.y));

	if (points.length < 2)
		return points.slice();

	let lower_hull = calc_half_hull(sorted_points);
	let upper_hull = calc_half_hull(sorted_points.slice().reverse());

	return [...lower_hull, ...upper_hull];	// concat two half-hull to form a convex hull

	function calc_half_hull(sorted_points) {
		let half_hull = [];

		for (let point of sorted_points) {
			for (let j = half_hull.length-1; j > 0; j--) {
				let pA = half_hull[j-1], pB = half_hull[j], pC = point;
				let vAB = Point2D.sub(pB, pA), vAC = Point2D.sub(pC, pA);

				if (Point2D.determinant(vAB, vAC) < 0)
					half_hull.pop();	// drop the previous point if A-B-C is right-curved
				else
					break;
			}
			half_hull.push(point);		// add the new point
		}
		half_hull.pop();	// drop the end point

		return half_hull;
	}
}

module.exports = {
	convex_hull_up_down,
};
