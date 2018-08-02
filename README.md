a Wordpress block with links to post headings.

## Installation

Simply download, install and enable the plugin, and the block will be available within the Gutenberg editor.

You must be using the Gutenberg editor, either by installing it as a plugin or by using Wordpress 5.

## Usage

When the block is added, it will automatically create a table of contents using the headings currently present within the post.

If you change the headings, click the "Refresh" button to update the table of contents.

You can set a title for the table of contents block on its property inspector. 

## Customization

The table of contents is made with standard HTML elements (`<ul>s` and `<li>s`), so it will behave like a regular part of your post.

If you do need to change how it's displayed, note that the block is wrapped in a div with the `wp-block-memuller-table-of-contents` class; this class can then be used for custom CSS stylings within your theme.

## Roadmap

- use the core/List block so the tables are completly editable
- use properly nested lists
- support both ordered and unordered lists
- handle empty lists and invalid outline structures
- eject from create-guten-block, simplify scripts
