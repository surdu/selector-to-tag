# Selector to Tag [![Build Status](https://travis-ci.org/surdu/selector-to-tag.svg?branch=master)](https://travis-ci.org/surdu/selector-to-tag)

Selector to Tag is an [Atom editor](https://atom.io/) package that allows you to create HTML tag elements using CSS selectors in HTML files.

Just type a CSS selector and press <kbd>TAB</kbd> :

![Demo animation](https://cloud.githubusercontent.com/assets/11520795/6700058/1b18986a-cd11-11e4-9d6a-848b808197c6.gif)

![Demo animation 2](https://cloud.githubusercontent.com/assets/865165/26415100/5137ad08-407f-11e7-8de0-d60f6453485b.gif)

## Supported selectors

For now the following selectors are possible:

Selector          | Output
------------------|------
`foo`             | `<foo></foo>` (when `Solve Plain Tags` option is enabled (default `true`))
`foo#bar`         | `<foo id="bar"></foo>`
`#foo`            | `<div id="foo"></div>`
`.foo`            | `<div class="foo"></div>`
`foo.bar`         | `<foo class="bar"></foo>`
`foo.bar.baz`     | `<foo class="bar baz"></foo>`
`foo#bar.baz`     | `<foo id="bar" class="baz"></foo>`
`foo#bar.baz.qux` | `<foo id="bar" class="baz qux"></foo>`

## Options

 - **File Extensions** - comma separated file extensions in which this package should be active *(Default: "htm, html, kit, shtml, tmpl, tpl, xhtml")*

 - **Only On HTML Grammar** - extension solves tags in any file that have the HTML grammar active. `File extensions` option will be ignored if this is enabled *(Default: false)*

 - **Solve Plain Tags** - this will indicate if this package should also solve to tags when there is no id or class specified in the selector. *(Default: true)*

 - **Close Self-Closing Tags** - Add a backslash before the end of self-closing tags. For example `<link>` will be solved to `<link/>` *(Default: false)*

 - **Expand Block Tags To Multiple Lines** - Puts the cursor and end tag on new lines. *(Default: false)*

 - **Block-Level Elements** - If "Expand block tags to multiple lines" is checked, these tags will count as block tags. *(Default: address, article, aside, audio, blockquote, canvas, dd, div, dl, fieldset, figcaption, figure, footer, form, header, hgroup, hr, main, nav, noscript, ol, output, p, pre, section, table, tfoot, ul, video)*

##Support

If you have any sugestions for other selectors or sugestions in general, please submit an issue on GitHub.
