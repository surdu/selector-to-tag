var utils = require("./utils");

function removeFirstChar(string) {
	return string.substring(1);
}

function SelectorSolver() {
	// For testing
	this.defaultFileTypes = ["htm", "html", "kit", "shtml", "tmpl", "tpl", "xhtml"];

	this.selfClosingTags = ["area", "br", "col", "embed", "hr", "img", "input",
			"link", "meta", "param"
	];

	atom.commands.add('atom-text-editor', {
			'selector-to-tag:solve-selector': utils.addSelf(this.handleCommand, this)
	});
}

SelectorSolver.prototype = {
	isHTML: function (filename, grammar) {
		if(atom.config.get('selector-to-tag.activeForGrammar'))
		{
			// check for grammar
			//console.log(grammar.toString());
			return grammar == ".text.html.basic";
		} else {
			var extension = filename.split(".");
			if (extension.length > 1)
			{
				extension = extension[extension.length - 1].toLowerCase();
				return (atom.config.get('selector-to-tag.activeForFileTypes') || this.defaultFileTypes).indexOf(extension) !== -1;
			}
		}
		return false;
	},

	solveSelector: function (selector, solveTagsOnly, closeSelfclosingTags, expandBlockTags, blockTags) {
		if (typeof blockTags === 'undefined') {
			blockTags = [];
		}

		var tag = (/^\w[\w-]*/.exec(selector) || [])[0];
		var id = (/#[\w-]+/.exec(selector) || []).map(removeFirstChar)[0];
		var classes = /(\.[\w-]+)/g.getAllMatches(selector).map(removeFirstChar);

		if ((solveTagsOnly && tag) || classes.length > 0 || id)
		{
			var string, isSelfClosing, isBlock;

			if (!tag) {
				tag = "div";
			}

			isSelfClosing = this.selfClosingTags.indexOf(tag) !== -1;
			isBlock = blockTags.indexOf(tag) !== -1;

			var element = document.createElement(tag);
			if (id)
			{
				element.id = id;
			}

			if (classes.length > 0)
			{
				element.className = classes.join(" ");
			}

			string = element.outerHTML;

			if (isSelfClosing && closeSelfclosingTags)
			{
				string = string.insertAt(string.length-1, "/");
			}
			else if (isBlock && expandBlockTags)
			{
				string = string.insertAt(string.indexOf("</"), "\n\n");
			}

			return {
				element: element,
				string: string,
				isSelfClosing: isSelfClosing,
				isBlock: isBlock
			};
		}

		return null;
	},

	handleCommand: function (event) {
		var editor = this.getModel();

		if (this.self.isHTML(editor.getTitle(), editor.getRootScopeDescriptor()))
		{
			var cursorPosition = editor.getCursorBufferPosition();
			var textOnCurrentLine = editor.lineTextForBufferRow(cursorPosition.row);
			var textBeforeCursor = textOnCurrentLine.substring(0, cursorPosition.column);
			var selector = /[^\s]*$/.exec(textBeforeCursor)[0]; // last word before cursor
			var expandBlockTags = atom.config.get('selector-to-tag.expandBlockTags');

			var solvedElement = this.self.solveSelector(selector,
			                                            atom.config.get('selector-to-tag.solveTagsOnly'),
			                                            atom.config.get('selector-to-tag.closeSelfclosingTags'),
			                                            expandBlockTags,
			                                            atom.config.get('selector-to-tag.blockTags'));

			if (solvedElement)
			{
				var selectorRange = [[cursorPosition.row, cursorPosition.column - selector.length],
				                      cursorPosition];

				if (expandBlockTags && solvedElement.isBlock)
				{
					editor.transact(function () {
						editor.setTextInBufferRange(selectorRange, solvedElement.string);
						editor.selectUp();
						editor.getLastSelection().autoIndentSelectedRows();
						editor.clearSelections();
						editor.moveToEndOfLine();
					});
				}
				else
				{
					editor.setTextInBufferRange(selectorRange, solvedElement.string);

					var newCursorPosition = editor.getCursorScreenPosition();

					if (solvedElement.isSelfClosing)
					{
						newCursorPosition.column -= atom.config.get('selector-to-tag.closeSelfclosingTags') ? 2 : 1;
						editor.setCursorScreenPosition(newCursorPosition);
					}
					else
					{
						newCursorPosition.column -= solvedElement.element.tagName.length + 3;
						editor.setCursorScreenPosition(newCursorPosition);
					}
				}
			}
			else
			{
				event.abortKeyBinding();
			}
		}
		else
		{
			event.abortKeyBinding();
		}
	}
};

module.exports = SelectorSolver;
