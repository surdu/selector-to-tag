var SelectorSolver = require("./selector-solver")

module.exports = {

    config: {
        solveTagsOnly: {
            type: "boolean",
            default: true,
            title: "Solve Tags Only",
            description: "Solve even if the selector is only the tag with no id and/or class. Enabeling this will basically override html-language package, so you could siable that package."
        },

        activeForFileTypes: {
            type: "array",
            default: ["htm", "html", "kit", "shtml", "tmpl", "tpl", "xhtml"],
            title: "File extensions",
            description: "Active for these file extensions",
            items: {
                type: "string"
            }
        }
    },

    activate: function(state) {
        var solver = new SelectorSolver();
    }
};
