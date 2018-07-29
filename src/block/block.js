//  Import CSS.
import './style.scss';
import './editor.scss';

import { Store } from './../store.js';

const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
const { BlockControls, RichText } = wp.editor;
const { IconButton } = wp.components;

import { Component } from '@wordpress/element';

class EditTableOfContents extends Component {
	state = {
		blocks: [],
	};

	/**
	 * Gets heading blocks into state.blocks and the built
	 * list items into attributes.content.
	 * @sets attributes, state
	 */
	refresh() {
		this.setState( { blocks: this.fetch() } );
		this.props.setAttributes( { content: this.buildTable() } );
		this.buildTable();
	}

	/**
	 * Processes heading blocks via Store and returns
	 * those heading blocks.
	 * @returns {[Elements]} an array of core/heading blocks
	 */
	fetch() {
		Store.dispatch.fetchBlocks();
		Store.dispatch.addAnchors();
		return Store.select.getBlocks();
	}

	/**
	 * Builds the list of <li>s that make up the table of contents.
	 * @returns {[Elements]} an array of <li>s
	 */
	buildTable() {
		const item = ( content, anchor ) => {
			return (
				<li key={ anchor }>
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
		return elements;
	}

	/**
	 * Sets initial state, if content attribute is not
	 * available from post content.
	 * @param {any} args none expected.
	 * @sets state, attributes
	 */
	constructor( args ) {
		super( args );
		const { state, props } = this;
		const { attributes } = props;
		state.blocks = this.fetch();
		if ( ! attributes.content ) {
			attributes.content = this.buildTable();
		}
	}

	render() {
		const { attributes, className } = this.props;
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

registerBlockType( 'memuller/table-of-contents', {
	title: __( 'Table of Contents' ),
	icon: 'list-view',
	category: 'layout',
	keywords: [
		__( 'table' ),
		__( 'table of contents' ),
		__( 'anchor' ),
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
