import { Component } from '@wordpress/element';

export class TableItem extends Component {
	static defaultProps = {
		title: '',
		level: 2,
		anchor: '',
	};

	render() {
		const { title, level, anchor } = this.props;
		const anchorClass = `lvl-${ level }`;
		return (
			<li key={ anchor } className={ anchorClass } >
				<a href={ '#' + anchor }> { title } </a>
			</li>
		);
	}
}

export default TableItem;
