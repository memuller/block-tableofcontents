const { registerStore, select, dispatch } = wp.data;
const { getBlocks } = select( 'core/editor' );
import { flatMap, kebabCase } from 'lodash';

const STORE_NAME = 'block.table-of-contents';
const DEFAULT_STATE = {
	heading_blocks: [],
};

/** Returns an HTML anchor-friendly for a given string
 * @param {string} text the string, expected to be a heading's content
 * @returns {string} the anchor-friendly result
*/
const anchorize = ( text ) => {
	return kebabCase( text );
};

/** Recursively fetches core/heading blocks.
 *  See fetchBlocks bellow and
 * https: //github.com/WordPress/gutenberg/blob/master/editor/components/document-outline/index.js
 * @param {?[Element]} blocks an array of blocks to search
 * @param {?[Element]} path the current search path
 * @returns {[Element]} a flat map of core/heading elements
 */
const recursiveGetHeadings = ( blocks = [], path = [] ) => {
	return flatMap( blocks, ( block = {} ) => {
		if ( block.name === 'core/heading' ) {
			return {
				...block,
				level: block.attributes.level,
				isEmpty: ! block.attributes.content || block.attributes.content.length === 0,
			};
		}
		return recursiveGetHeadings( block.innerBlocks, [ ...path, block ] );
	} );
};

registerStore( STORE_NAME, {
	reducer( state = DEFAULT_STATE, action ) {
		switch ( action.type ) {
			case 'SET_BLOCKS':
				return {
					...state,
					heading_blocks: action.blocks,
				};

			case 'ADD_ANCHORS':
				for ( const heading of state.heading_blocks ) {
					if ( ! ( heading.isEmpty ) && ! heading.attributes.anchor ) {
						heading.attributes.anchor = anchorize( heading.attributes.content );
					}
				}
				return state;

			case 'FETCH_BLOCKS':
				return {
					...state,
					heading_blocks: recursiveGetHeadings( getBlocks() ),
				};
		}
	},

	actions: {
		// Stores given blocks.
		setBlocks( blocks = [] ) {
			return {
				type: 'SET_BLOCKS',
				blocks,
			};
		},
		// Adds an anchor to all blocks that are not empty
		// and do not already have an anchor set.
		addAnchors() {
			return {
				type: 'ADD_ANCHORS',
			};
		},
		/** Fetches heading blocks, enriches, and stores them.
		 *
		 * Gets all blocks from core/editor store;
		 * then if they're core/heading blocks, enriches them with:
		 * 	- level: the heading level
		 * 	- isEmpty: true if there's no text in the heading
		 * Stores them using setBlocks afterwards.
		 *
		 * @triggers setBlocks
		 * @returns {Object} new state
		 * */
		fetchBlocks() {
			return {
				type: 'FETCH_BLOCKS',
			};
		}

	},

	selectors: {
		getBlocks( state ) {
			return state.heading_blocks;
		},
	},

	resolvers: {},

} );

export const Store = {
	select: select( STORE_NAME ),
	dispatch: dispatch( STORE_NAME ),
};

export default Store;
