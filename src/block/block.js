//  Import CSS.
import './style.scss';
import './editor.scss';

const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
const { BlockControls, RichText, InspectorControls } = wp.editor;
const { Toolbar, TextControl, PanelBody } = wp.components;

import { Component } from 'react';

import { Store } from './../store.js';
import { TableItem } from './TableItem.js';

class EditTableOfContents extends Component {
	state = {
		blocks: [],
	};

	/**
	 * Gets heading blocks into state.blocks and the built
	 * list items into attributes.content.
	 * @sets attributes, state
	 */
	refresh = () => {
		this.setState( { blocks: this.fetch() } );
		this.props.setAttributes( { content: this.buildTable() } );
		this.buildTable();
	}

	/**
	 * Sets title property.
	 * @param {String} text text to be set
	 * @sets attributes
	 */
	setTitle = ( text ) => {
		this.props.setAttributes( { title: text } );
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
		const elements = [];
		for ( const block of this.state.blocks ) {
			elements.push(
				<TableItem
					title={ block.attributes.content }
					level={ block.level }
					anchor={ block.attributes.anchor }
				/>
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
		const { attributes, className, isSelected } = this.props;

		let titleSection = '';
		if ( attributes.title && attributes.title.length > 0 ) {
			titleSection = <h2> { attributes.title } </h2>;
		}

		let inspectorSection = '';
		if ( isSelected ) {
			inspectorSection =
				<InspectorControls>
					<PanelBody title={ __( 'Display Settings' ) }>
						<TextControl label={ __( 'Title' ) + ` (${ __( 'optional' ) })` } value={ attributes.title } onChange={ this.setTitle } />
					</PanelBody>
				</InspectorControls>;
		}

		return (
			<div className={ className }>
				<BlockControls key="controls">
					<Toolbar controls={ [ {
						icon: 'update',
						title: __( 'Refresh' ),
						onClick: this.refresh,
					} ] } />
				</BlockControls>
				{ inspectorSection }
				{ titleSection }
				<RichText.Content tagName="ul" value={ attributes.content } />
			</div>
		);
	}
}

registerBlockType( 'memuller/table-of-contents', {
	title: __( 'Table of Contents' ),
	description: __( 'a clickable list of headings.' ),
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
		title: {
			source: 'text',
			selector: 'h2',
			default: null,
		},
	},

	edit: EditTableOfContents,
	save: function( { className, attributes } ) {
		let title;
		if ( attributes.title && attributes.title.length > 0 ) {
			title = <h2> { attributes.title } </h2>;
		} else {
			title = '';
		}
		return (
			<div className={ className }>
				{ title }
				<RichText.Content tagName="ul" value={ attributes.content } />
			</div>
		);
	},
} );
