require("./utils");

function removeFirstChar(string) {
	return string.substring(1);
}

class SelectorSolver {
	constructor(availableAPI) {
		this.defaultFileTypes = [
			"htm",
			"html",
			"kit",
			"shtml",
			"tmpl",
			"tpl",
			"xhtml",
		];
		this.availableAPI = availableAPI;

		this.selfClosingTags = [
			"area",
			"br",
			"col",
			"embed",
			"hr",
			"img",
			"input",
			"link",
			"meta",
			"param",
		];

		atom.commands.add("atom-text-editor", {
			"selector-to-tag:solve-selector": this.handleCommand.bind(this),
		});
	}

	isHTML(filename, grammar) {
		if (atom.config.get("selector-to-tag.activeForGrammar")) {
			// check for grammar
			return grammar === ".text.html.basic";
		} else {
			var extension = filename.split(".");
			if (extension.length > 1) {
				extension = extension[extension.length - 1].toLowerCase();
				return (
					(
						atom.config.get("selector-to-tag.activeForFileTypes") ||
						this.defaultFileTypes
					).indexOf(extension) !== -1
				);
			}
		}
		return false;
	}

	solveSelector(
		selector,
		solveTagsOnly,
		closeSelfclosingTags,
		expandBlockTags,
		blockTags,
		editor
	) {
		if (typeof blockTags === "undefined") {
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
			let string, snippet, isSelfClosing, isBlock;

			if (!tag) {
				tag = "div";
			}

			isSelfClosing = this.selfClosingTags.indexOf(tag) !== -1;
			isBlock = blockTags.indexOf(tag) !== -1;

			var element = document.createElementNS(
				"http://www.w3.org/1999/xhtml",
				tag
			);

			if (id) {
				element.id = id;
			}

			if (classes.length > 0) {
				element.className = classes.join(" ");
			}

			string = element.outerHTML;
			snippet = string;

			if (isSelfClosing) {
				if (closeSelfclosingTags) {
					string = string.insertAt(string.length - 1, "/");
				}
				snippet = snippet.insertAt(snippet.length - 1, "$1");
			}

			if (isBlock) {
				if (expandBlockTags) {
					string = string.insertAt(string.indexOf("</"), "\n\n");
					snippet = snippet.insertAt(
						snippet.indexOf("</"),
						`\n${editor.buildIndentString(1)}$2\n`
					);
				} else {
					snippet = snippet.insertAt(snippet.indexOf("</"), "$2");
				}

				snippet = snippet.insertAt(snippet.indexOf(">"), "$1");
			}

			return { element, string, isSelfClosing, isBlock, snippet };
		}

		return null;
	}

	insertSolvedText(solvedElement, selectorRange, editor) {
		if (this.availableAPI.snippetsAPI) {
			const snippetsAPI = this.availableAPI.snippetsAPI;
			editor.setTextInBufferRange(selectorRange, "");
			snippetsAPI.insertSnippet(solvedElement.snippet, editor);
		} else {
			editor.setTextInBufferRange(selectorRange, solvedElement.string);
		}
	}

	handleCommand(event) {
		const editor = event.currentTarget.getModel();

		if (!this.isHTML(editor.getTitle(), editor.getRootScopeDescriptor())) {
			event.abortKeyBinding();
			return;
		}

		const cursorPosition = editor.getCursorBufferPosition();
		const textBeforeCursor = editor.getTextInBufferRange([
			[0, 0],
			cursorPosition,
		]);

		const lastClosingBracketIndex = textBeforeCursor.lastIndexOf(">");
		const lastOpeningBracketIndex = textBeforeCursor.lastIndexOf("<");
		const isInsideTag = lastOpeningBracketIndex > lastClosingBracketIndex;

		if (isInsideTag) {
			event.abortKeyBinding();
			return;
		}

		const match = /\s*([\w.#-_:]*)$/.exec(textBeforeCursor);

		if (!match || match.length < 1) {
			event.abortKeyBinding();
			return;
		}

		const expandBlockTags = atom.config.get("selector-to-tag.expandBlockTags");
		const solveTagsOnly = atom.config.get("selector-to-tag.solveTagsOnly");
		const closeSelfclosingTags = atom.config.get(
			"selector-to-tag.closeSelfclosingTags"
		);
		const blockTags = atom.config.get("selector-to-tag.blockTags");

		const selector = match[1];
		const solvedElement = this.solveSelector(
			selector,
			solveTagsOnly,
			closeSelfclosingTags,
			expandBlockTags,
			blockTags,
			editor
		);

		if (!solvedElement) {
			event.abortKeyBinding();
			return;
		}

		const selectorRange = [
			[cursorPosition.row, cursorPosition.column - selector.length],
			cursorPosition,
		];

		if (expandBlockTags && solvedElement.isBlock) {
			editor.transact(() => {
				this.insertSolvedText(solvedElement, selectorRange, editor);

				if (!this.availableAPI.snippetsAPI) {
					editor.selectUp();
					editor.getLastSelection().autoIndentSelectedRows();
					editor.clearSelections();
					editor.moveToEndOfLine();
				}
			});
		} else {
			this.insertSolvedText(solvedElement, selectorRange, editor);

			if (!this.availableAPI.snippetsAPI) {
				const newCursorPosition = editor.getCursorScreenPosition();

				if (solvedElement.isSelfClosing) {
					if (atom.config.get("selector-to-tag.closeSelfclosingTags")) {
						newCursorPosition.column -= 2;
					} else {
						newCursorPosition.column -= 1;
					}

					editor.setCursorScreenPosition(newCursorPosition);
				} else {
					newCursorPosition.column -= solvedElement.element.tagName.length + 3;
					editor.setCursorScreenPosition(newCursorPosition);
				}
			}
		}
	}
}

module.exports = SelectorSolver;
