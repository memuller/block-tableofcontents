/**
 * BLOCK: block-table-contents
 *
 * Registering a basic block with Gutenberg.
 * Simple block, renders and saves the same content without any interactivity.
 */

//  Import CSS.
import './style.scss';
import './editor.scss';

import { Store } from './../store.js';

const { __ } = wp.i18n; // Import __() from wp.i18n
const { registerBlockType, children } = wp.blocks; // Import registerBlockType() from wp.blocks
const { BlockControls, RichText } = wp.editor;
const { IconButton } = wp.components;

import { Component, RawHTML } from '@wordpress/element';

class EditTableOfContents extends Component {
	state = {
		blocks: [],
	};

	refresh() {
		this.setState( { blocks: this.fetch() } );
		this.buildTable();
	}

	fetch() {
		Store.dispatch.fetchBlocks();
		Store.dispatch.addAnchors();
		return Store.select.getBlocks();
	}

	buildTable() {
		const { setAttributes } = this.props;
		const item = ( content, anchor ) => {
			return (
				<li>
					<a href={ '#' + anchor } > { content } </a>
				</li>
			);
		};
		const elements = [];
		for ( const block of this.state.blocks ) {
			elements.push(
				item( block.attributes.content, block.attributes.anchor )
			);
		}
		setAttributes( { content: elements } );
		return elements;
	}

	constructor( args ) {
		super( args );
		this.state.blocks = this.fetch();
		if ( ! this.props.attributes.content ) {
			this.props.attributes.content = this.buildTable();
		}
	}

	render() {
		const { attributes, setAttributes, className } = this.props;
		return (
			<div className={ className }>
				<BlockControls key="controls">
					<IconButton
						icon="update" label="Refresh" onClick={ this.refresh.bind( this ) }
					/>
				</BlockControls>
				<RichText.Content tagName="ul" value={ attributes.content } />
			</div>
		);
	}
}

registerBlockType( 'cgb/block-block-table-contents', {
	// Block name. Block names must be string that contains a namespace prefix. Example: my-plugin/my-custom-block.
	title: __( 'block-table-contents - CGB Block' ),
	icon: 'list-view',
	category: 'layout',
	keywords: [
		__( 'block-table-contents — CGB Block' ),
		__( 'CGB Example' ),
		__( 'create-guten-block' ),
	],

	attributes: {
		content: {
			source: 'children',
			selector: 'ul',
			default: null,
		},
	},

	edit: EditTableOfContents,
	save: function( { className, attributes } ) {
		return (
			<div className={ className }>
				<RichText.Content tagName="ul" value={ attributes.content } />
			</div>
		);
	},
} );
