# Selector to Tag [![Build Status](https://travis-ci.org/surdu/selector-to-tag.svg?branch=master)](https://travis-ci.org/surdu/selector-to-tag)

Selector to Tag is an [Atom editor](https://atom.io/) package that allows you to create HTML tag elements using CSS selectors in HTML files.

Just type a CSS selector and press <kbd>TAB</kbd> :

![Demo animation](https://cloud.githubusercontent.com/assets/11520795/6700058/1b18986a-cd11-11e4-9d6a-848b808197c6.gif)

## Supported selectors

For now the following selectors are possible:

Selector          | Output
------------------|------
`foo`             | `<foo></foo>`
`foo#bar`         | `<foo id="bar"></foo>`
`#foo`            | `<div id="foo"></div>`
`.foo`            | `<div class="foo"></div>`
`foo.bar`         | `<foo class="bar"></foo>`
`foo.bar.baz`     | `<foo class="bar baz"></foo>`
`foo#bar.baz`     | `<foo id="bar" class="baz"></foo>`
`foo#bar.baz.qux` | `<foo id="bar" class="baz qux"></foo>`

## Options

 - **File extensions** - comma separated file extensions in which this package should be active *(Default: "htm, html, kit, shtml, tmpl, tpl, xhtml")*

 - **Only on HTML grammar** - extension solves tags in any file that have the HTML grammar active. `File extensions` option will be ignored if this is enabled

 - **Solve Tags** - this will indicate if this package should also solve tags when there is no id or class specified. When this is activated it will basically override the default `html-language` package, so you could disable that package. *(Default: true)*

 - **Close self-closing tags** - Add a backslash before the end of self-closing tags. For example `<link>` will be solved to `<link/>` *(Default: false)*

 - **Expand block tags to multiple lines** - Puts the cursor and end tag on new lines. *(Default: false)*

 - **Block-level elements** - If "Expand block tags to multiple lines" is checked, these tags will count as block tags. *(Default: address, article, aside, audio, blockquote, canvas, dd, div, dl, fieldset, figcaption, figure, footer, form, header, hgroup, hr, main, nav, noscript, ol, output, p, pre, section, table, tfoot, ul, video)*

##Support

If you have any sugestions for other selectors or sugestions in general, please submit an issue on GitHub.
