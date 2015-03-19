var SelectorSolver = require("./selector-solver")

module.exports = {

    config: {
        solveTagsOnly: {
            type: "boolean",
            default: true,
            title: "Solve Tags",
            description: "Solve even if the selector is only the tag with no id and/or class. Enabling this will basically override html-language package, so you could disable that package."
        },

        activeForFileTypes: {
            type: "array",
            default: ["htm", "html", "kit", "shtml", "tmpl", "tpl", "xhtml"],
            title: "File extensions",
            description: "Active for these file extensions",
            items: {
                type: "string"
            }
        },

        closeSelfclosingTags: {
            type: "boolean",
            default: false,
            title: "Close self-closing tags",
            description: "Add a backslash before the end of self-closing tags"
        }
    },

    activate: function(state) {
        var solver = new SelectorSolver();
    }
};
