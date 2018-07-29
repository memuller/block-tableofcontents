import { Component } from '@wordpress/element';

export class TableItem extends Component {
	static defaultProps = {
		title: '',
		level: 2,
		anchor: '',
	};

	render() {
		const { title, level, anchor } = this.props;
		return (
			<li key={ anchor } >
				<a href={ '#' + anchor }> { title } </a>
			</li>
		);
	}
}

export default TableItem;
