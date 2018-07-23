const { registerStore, select, dispatch } = wp.data;
const { getBlocks } = select( 'core/editor' );
import { flatMap } from 'lodash';

const STORE_NAME = 'block.table-of-contents';
const DEFAULT_STATE = {
	heading_blocks: [],
};

const Store = registerStore( STORE_NAME, {
	reducer( state = DEFAULT_STATE, action ) {
		switch ( action.type ) {
			case 'SET_BLOCKS':
				return {
					...state,
					heading_blocks: action.blocks,
				};
			case 'FETCH_BLOCKS':
				return {

				}
		}
	},

	actions: {
		setBlocks( blocks = [] ) {
			return {
				type: 'SET_BLOCKS',
				blocks,
			};
		},
	},

	selectors: {
		getBlocks( state ) {
			return state.heading_blocks;
		},
	},

	resolvers: {
		getBlocks( state ) {
			const blocks = flatMap( getBlocks(), ( block = {} ) => {
				if ( block.name === 'core/heading' ) {
					return {
						...block,
						level: block.attributes.level,
						isEmpty: ! block.attributes.content || block.attributes.content.length === 0,
					};
				}
				return [];
			} );
			dispatch( STORE_NAME ).setBlocks( blocks );
		},
	},

} );

export default Store;
