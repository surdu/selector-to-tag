var utils = require("./utils");

function SelectorSolver() {

    //TODO: place this in settings
    this.activeForFileTypes = [
        "htm",
        "html",
        "kit",
        "shtml",
        "tmpl",
        "tpl",
        "xhtml"];

    atom.commands.add('atom-text-editor', {
        'selector-to-tag:solve-selector': utils.addSelf(this.solve, this)
    });
}

SelectorSolver.prototype = {
    isHTML: function (filename) {
        var extension = filename.split(".");
        if (extension.length > 1)
        {
            extension = extension[extension.length - 1].toLowerCase();
            return this.activeForFileTypes.indexOf(extension) !== -1;
        }

        return false;
    },

    solveSelector: function (selector) {
        if (selector.indexOf(".") !== -1 || selector.indexOf("#") !== -1)
        {
            var tag = /^[\w]*/.exec(selector);
            var id = /#[\w]*/.exec(selector);
            var classes = /(\.[\w]*)/g.exec(selector);
        }

        return null;
    },

    solve: function (event) {
        var editor = this.getModel();

        if (this.self.isHTML(editor.getTitle()))
        {
            var cursorPosition = editor.getCursorScreenPosition();
            var textOnCurrentLine = editor.lineTextForScreenRow(cursorPosition.row);
            var textBeforeCursor = textOnCurrentLine.substring(0, cursorPosition.column);
            var lastWordBeforeCursor = /[^\s]*$/.exec(textBeforeCursor);


            editor.insertText("Tada!!");
        }
        else
        {
            event.abortKeyBinding();
        }
    }
}

module.exports = SelectorSolver;
