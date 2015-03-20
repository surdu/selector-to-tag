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
  isHTML: function (filename) {
    var extension = filename.split(".");
    if (extension.length > 1)
    {
      extension = extension[extension.length - 1].toLowerCase();
      return (atom.config.get('selector-to-tag.activeForFileTypes') || this.defaultFileTypes).indexOf(extension) !== -1;
    }

    return false;
  },

  solveSelector: function (selector, solveTagsOnly, closeSelfclosingTags) {
    if (solveTagsOnly || selector.indexOf(".") !== -1 || selector.indexOf("#") !== -1)
    {
      var tag = (/^\w[\w-]*/.exec(selector) || [])[0];
      var id = (/#[\w-]*/.exec(selector) || []).map(removeFirstChar)[0];
      var classes = /(\.[\w-]*)/g.getAllMatches(selector).map(removeFirstChar);

      var string, isSelfClosing;

      if (tag)
      {
        isSelfClosing = this.selfClosingTags.indexOf(tag) !== -1;

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

        return {
          element: element,
          string: string,
          isSelfClosing: isSelfClosing
        };
      }
    }

    return null;
  },

  handleCommand: function (event) {
    var editor = this.getModel();

    if (this.self.isHTML(editor.getTitle()))
    {
      var cursorPosition = editor.getCursorBufferPosition();
      var textOnCurrentLine = editor.lineTextForBufferRow(cursorPosition.row);
      var textBeforeCursor = textOnCurrentLine.substring(0, cursorPosition.column);
      var selector = /[^\s]*$/.exec(textBeforeCursor)[0]; // last word before cursor

      var solvedElement = this.self.solveSelector(selector,
                                                  atom.config.get('selector-to-tag.solveTagsOnly'),
                                                  atom.config.get('selector-to-tag.closeSelfclosingTags'));

      if (solvedElement)
      {
        var selectorRange = [[cursorPosition.row, cursorPosition.column - selector.length],
                              cursorPosition];
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
}

module.exports = SelectorSolver;
