const assert = require('assert');
const Point2D = require('../util/Point2D');

describe('chap.02 divide_and_conquer', function() {
	describe('convex_hull', function() {
		let { convex_hull_up_down } = require('../divide_and_conquer/convex_hull');

		let testcases = [
			{
				data: [],
				expected_result: [],
			},
			{
				data: [new Point2D(1, 3)],
				expected_result: [new Point2D(1, 3)],
			},
			{
				data: [new Point2D(5, 7), new Point2D(1, 3)],
				expected_result: [new Point2D(1, 3), new Point2D(5, 7)],
			},
			{
				data: [new Point2D(1, 1), new Point2D(2, 4), new Point2D(5, 2)],
				expected_result: [new Point2D(1, 1), new Point2D(5, 2), new Point2D(2, 4)],
			},
			{
				data: [new Point2D(1, 2), new Point2D(2, 4), new Point2D(3, 6)],
				expected_result: [
					new Point2D(1, 2), new Point2D(2, 4),
					new Point2D(3, 6), new Point2D(2, 4),
				],	// collinear hull may have duplicated points
			},
			{
				data: [
					[14, 8], [6, 2], [2, 4], [10, 10], [6, 8], [4, 10],
					[8, 6], [8, 12], [2, 8], [10, 2], [12, 4], [4, 6],
				].map(([x, y]) => new Point2D(x, y)),
				expected_result: [
					[2, 4], [6, 2], [10, 2], [12, 4],
					[14, 8], [8, 12], [4, 10], [2, 8],
				].map(([x, y]) => new Point2D(x, y)),
			},
		];

		it('convex_hull_up_down correct', function() {
			for (let { data, expected_result } of testcases) {
				assert.deepStrictEqual(convex_hull_up_down(data), expected_result);
			}
		});
	});
});
