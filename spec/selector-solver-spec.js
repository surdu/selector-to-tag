var SelectorSolver = require("../lib/selector-solver");

describe("HTML detector", function () {
    var solver;

    beforeEach(function () {
        solver = new SelectorSolver();
    });

    it("should handle files with no extension", function () {
        expect(solver.isHTML("untitled")).toBe(false);
    });

    it("should detect HTML files", function () {
        expect(solver.isHTML("test.HTML")).toBe(true);
    });
});

describe("Tag solver", function () {
    var solver;

    beforeEach(function () {
        solver = new SelectorSolver();
    });

    it("should solve tag alone", function () {
        expect(solver.solveSelector("div", true).string).toBe('<div></div>');
    });

    it("should solve unknown tags", function () {
        expect(solver.solveSelector("ceva", true).string).toBe('<ceva></ceva>');
    });

    it("should solve tag with id", function () {
        expect(solver.solveSelector("div#mama").string).toBe('<div id="mama"></div>');
    });

    it("should solve tag with id and class", function () {
        expect(solver.solveSelector("div#mama.tata").string).toBe('<div id="mama" class="tata"></div>');
    });

    it("should solve tag with id and multiple classes", function () {
        expect(solver.solveSelector("div#mama.tata.sora").string).toBe('<div id="mama" class="tata sora"></div>');
    });
})
