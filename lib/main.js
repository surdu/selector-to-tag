"use strict";

var SelectorSolver = require("./selector-solver");

module.exports = {

	config: {
		solveTagsOnly: {
			type: "boolean",
			default: true,
			title: "Solve Plain Tags",
			description: "Solve to tag even if the selector is only the tag with no id and/or class."
		},

		activeForFileTypes: {
			type: "array",
			default: ["htm", "html", "kit", "shtml", "tmpl", "tpl", "xhtml", "jsx"],
			title: "File Extensions",
			description: "Active for these file extensions",
			items: {
				type: "string"
			}
		},

		activeForGrammar: {
			type: "boolean",
			default: false,
			title: "Only On HTML Grammar",
			description: "Active only if HTML grammar is selected. The `File Extensions` option will be ignored if this is enabled.",
		},

		closeSelfclosingTags: {
			type: "boolean",
			default: false,
			title: "Close Self-Closing Tags",
			description: "Add a backslash before the end of self-closing tags"
		},

		expandBlockTags: {
			type: "boolean",
			default: false,
			title: "Expand Block Tags To Multiple Lines",
			description: "Put end tag on a new line"
		},

		blockTags: {
			type: "array",
			default: [
				"address", "article", "aside", "audio", "blockquote", "canvas",
				"dd", "div", "dl", "fieldset", "figcaption", "figure", "footer",
				"form", "header", "hgroup", "hr", "main", "nav", "noscript",
				"ol", "output", "p", "pre", "section", "table", "tfoot", "ul",
				"video"
			],
			title: "Block-Level Elements",
			description: "HTML tags that will be expanded to multiple lines."
		}
	},

	activate: function() {
		new SelectorSolver();
	}
};
