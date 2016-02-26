var SelectorSolver = require("../lib/selector-solver");
var path = require('path');
var fs = require('fs');

function readExpected(file) {
	return fs.readFileSync(path.join(__dirname, "./fixtures/after", file), "utf8");
}

function pressTab(editorView) {
	var event = keydownEvent("tab", {target: editorView});
	atom.keymaps.handleKeyboardEvent(event.originalEvent);
}

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

describe("Tag solver2", function () {
	var editor;
	var editorView;

	beforeEach(function () {

		waitsForPromise(function () {
			return atom.packages.activatePackage("selector-to-tab");
		});

		waitsForPromise(function () {
			return atom.packages.activatePackage("snippets");
		});

		waitsForPromise(function () {
			return atom.packages.activatePackage("language-html", {sync: true});
		});

	});

	runs(function () {
		alert("aici!")
		editor = atom.workspace.getActiveTextEditor();
		editorView = atom.views.getView(editor);
	});

	it("should solve block tags", function () {
		waitsForPromise(function () {
			return atom.workspace.open("before/blockTag.html");
		});

		pressTab(editorView);

		var expected = readExpected("blockTag.html");

		expect(editor.getText()).toBe(expected);
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

	it("should solve selectors containing - and _", function () {
		expect(solver.solveSelector("some-tag_1#id-1_2.class_1.class-2").string).toBe('<some-tag_1 id="id-1_2" class="class_1 class-2"></some-tag_1>');
	});

	it("should solve self-closing tags", function () {
		expect(solver.solveSelector("link", true).string).toBe('<link>');
	});

	it("should close self-closing tags", function () {
		expect(solver.solveSelector("link", true, true).string).toBe('<link/>');
	});

	it("should expand block tags to multiple lines", function () {
		expect(solver.solveSelector("div#mama", true, true, true, ['div']).string).toBe('<div id="mama">\n\n</div>');
	});

	it("shouldn't expand tag if class or id is not specified", function () {
		expect(solver.solveSelector("div#")).toBeNull();
		expect(solver.solveSelector("div.")).toBeNull();
	});

	it("should solve to div if only class or id specified", function () {
		expect(solver.solveSelector(".mama").string).toBe('<div class="mama"></div>');
		expect(solver.solveSelector("#tata").string).toBe('<div id="tata"></div>');
	});

	it("should not solve to div if nothing is specified", function () {
		expect(solver.solveSelector("", true)).toBeNull();
	});
});
