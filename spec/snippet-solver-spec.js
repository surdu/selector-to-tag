describe("Snippet solver", function () {
	var editor;
	var editorView;

	beforeEach(function () {
		waitsForPromise(function () {
			return atom.workspace.open("test.html");
		});

		waitsForPromise(function () {
			const selectorToTag = atom.packages.activatePackage("selector-to-tag");
			const snippets = atom.packages.activatePackage("snippets");
			return Promise.all([selectorToTag, snippets]);
		});

		atom.config.unset("selector-to-tag.closeSelfclosingTags");
		atom.config.unset("selector-to-tag.expandBlockTags");

		runs(function () {
			editor = atom.workspace.getActiveTextEditor();
			editor.setText("");
			editorView = atom.views.getView(editor);
		});
	});

	it("should solve inline tags", function () {
		editor.setText("link");
		editor.moveToEndOfLine();

		atom.commands.dispatch(editorView, "selector-to-tag:solve-selector");

		expect(editor.getText()).toBe("<link>");

		expect(editor.getCursorScreenPosition()).toEqual([0, 5]);
	});

	it("should solve block tags", function () {
		editor.setText("div");
		editor.moveToEndOfLine();

		atom.commands.dispatch(editorView, "selector-to-tag:solve-selector");

		expect(editor.getText()).toBe("<div></div>");
		expect(editor.getCursorScreenPosition()).toEqual([0, 4]);

		atom.commands.dispatch(editorView, "snippets:next-tab-stop");

		expect(editor.getCursorScreenPosition()).toEqual([0, 5]);
	});

	it("should solve expanded block tags", function () {
		atom.config.set("selector-to-tag.expandBlockTags", true);

		editor.setText("div");
		editor.moveToEndOfLine();

		atom.commands.dispatch(editorView, "selector-to-tag:solve-selector");

		expect(editor.getText()).toBe("<div>\n  \n</div>");
		expect(editor.getCursorScreenPosition()).toEqual([0, 4]);

		atom.commands.dispatch(editorView, "snippets:next-tab-stop");

		expect(editor.getCursorScreenPosition()).toEqual([1, 2]);
	});

	it("should respect indent style", function () {
		atom.config.set("selector-to-tag.expandBlockTags", true);
		atom.config.set("editor.tabType", "hard");
		atom.config.set("editor.tabLength", 4);

		editor.setText("div");
		editor.moveToEndOfLine();

		atom.commands.dispatch(editorView, "selector-to-tag:solve-selector");

		expect(editor.getText()).toBe("<div>\n\t\n</div>");
		expect(editor.getCursorScreenPosition()).toEqual([0, 4]);

		atom.commands.dispatch(editorView, "snippets:next-tab-stop");

		expect(editor.getCursorScreenPosition()).toEqual([1, 4]);
	});
});
