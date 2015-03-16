var SelectorSolver = require("../lib/selector-solver");

describe("Detect HTML", function () {
    var solver;

    beforeEach(function () {
        solver = new SelectorSolver();
    })

    it("should handle files with no extension", function () {
        expect(solver.isHTML("untitled")).toBe(false);
    });

    it("should detect HTML files", function () {
        expect(solver.isHTML("test.HTML")).toBe(true);
    })
});
