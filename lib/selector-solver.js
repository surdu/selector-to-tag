/* globals atom, document */

require("./utils");

function removeFirstChar(string) {
	return string.substring(1);
}

class SelectorSolver {
	constructor() {
		this.defaultFileTypes = ["htm", "html", "kit", "shtml", "tmpl", "tpl", "xhtml"];

		this.selfClosingTags = ["area", "br", "col", "embed", "hr", "img", "input",
			"link", "meta", "param"
		];

		atom.commands.add('atom-text-editor', {
			'selector-to-tag:solve-selector': this.handleCommand.bind(this)
		});
	}

	isHTML(filename, grammar) {
		if(atom.config.get('selector-to-tag.activeForGrammar')) {
			// check for grammar
			return grammar === ".text.html.basic";
		}
		else {
			var extension = filename.split(".");
			if (extension.length > 1) {
				extension = extension[extension.length - 1].toLowerCase();
				return (atom.config.get('selector-to-tag.activeForFileTypes') || this.defaultFileTypes).indexOf(extension) !== -1;
			}
		}
		return false;
	}

	solveSelector(selector, solveTagsOnly, closeSelfclosingTags, expandBlockTags, blockTags) {
		if (typeof blockTags === 'undefined') {
			blockTags = [];
		}

		// it shouldn't expand tag if class or id is not specified
		if (selector.substr(-1) === "#" || selector.substr(-1) === ".") {
			return null;
		}

		var tag = (/^[a-zA-Z][\w-:]*/.exec(selector) || [])[0];
		const id = (/#[\w-]+/.exec(selector) || []).map(removeFirstChar)[0];
		const classes = /(\.[\w-]+)/g.getAllMatches(selector).map(removeFirstChar);

		if ((solveTagsOnly && tag) || classes.length > 0 || id) {
			let string, isSelfClosing, isBlock;

			if (!tag) {
				tag = "div";
			}

			isSelfClosing = this.selfClosingTags.indexOf(tag) !== -1;
			isBlock = blockTags.indexOf(tag) !== -1;

			var element = document.createElementNS("http://www.w3.org/1999/xhtml", tag);
			if (id) {
				element.id = id;
			}

			if (classes.length > 0) {
				element.className = classes.join(" ");
			}

			string = element.outerHTML;

			if (isSelfClosing && closeSelfclosingTags) {
				string = string.insertAt(string.length-1, "/");
			}
			else if (isBlock && expandBlockTags) {
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
	}

	handleCommand(event) {
		const editor = event.currentTarget.getModel();

		if (this.isHTML(editor.getTitle(), editor.getRootScopeDescriptor())) {
			const cursorPosition = editor.getCursorBufferPosition();
			const textOnCurrentLine = editor.lineTextForBufferRow(cursorPosition.row);
			const textBeforeCursor = textOnCurrentLine.substring(0, cursorPosition.column);
			const expandBlockTags = atom.config.get('selector-to-tag.expandBlockTags');

			// make sure the text before the cursor is a valid selector
			// only preceded by spaces
			const match = /^\s*([\w.#-_:]*)$/.exec(textBeforeCursor);

			if (!match || match.length < 1) {
				return;
			}

			const selector = match[1];
			const solvedElement = this.solveSelector(selector,
			                                         atom.config.get('selector-to-tag.solveTagsOnly'),
			                                         atom.config.get('selector-to-tag.closeSelfclosingTags'),
			                                         expandBlockTags,
			                                         atom.config.get('selector-to-tag.blockTags'));

			if (solvedElement) {
				const selectorRange = [[cursorPosition.row, cursorPosition.column - selector.length],
				                      cursorPosition];

				if (expandBlockTags && solvedElement.isBlock) {
					editor.transact(function () {
						editor.setTextInBufferRange(selectorRange, solvedElement.string);
						editor.selectUp();
						editor.getLastSelection().autoIndentSelectedRows();
						editor.clearSelections();
						editor.moveToEndOfLine();
					});
				}
				else {
					editor.setTextInBufferRange(selectorRange, solvedElement.string);

					const newCursorPosition = editor.getCursorScreenPosition();

					if (solvedElement.isSelfClosing) {
						newCursorPosition.column -= atom.config.get('selector-to-tag.closeSelfclosingTags') ? 2 : 1;
						editor.setCursorScreenPosition(newCursorPosition);
					}
					else {
						newCursorPosition.column -= solvedElement.element.tagName.length + 3;
						editor.setCursorScreenPosition(newCursorPosition);
					}
				}
			}
			else {
				event.abortKeyBinding();
			}
		}
		else {
			event.abortKeyBinding();
		}
	}
}

module.exports = SelectorSolver;
