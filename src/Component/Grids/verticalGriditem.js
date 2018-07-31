import React from 'react';
import { isEqual } from 'lodash';


export default class Item extends React.Component {

	/**
	* This function return grid item width
	* @param {null} 
	* @returns {integer}
	*/
	_itemWidth() {
		return this.props.dimensions.width;
	}

	/**
	 * This function return grid item left position
	 * @param {null} 
	 * @returns {integer}
	 */
	_itemLeft() {
		var column = this.props.index % this.props.dimensions.itemsPerRow;
		return column * this.props.dimensions.width;
	}

	/**
	 * This function return grid item top position
	 * @param {null} 
	 * @returns {integer}
	 */
	_itemTop() {
		return Math.floor(this.props.index / this.props.dimensions.itemsPerRow) * this.props.dimensions.height;
	}

	// LIFECYCLE
	shouldComponentUpdate(nextProps, nextState) {
		return !isEqual(this.props, nextProps);
	}

	// RENDER
	render() {
		const _style = {
			width: this._itemWidth() - (2 * this.props.paddingLeft),
			height: this.props.dimensions.height - (2 * this.props.paddingBottom),
			left: this._itemLeft(),
			top: this._itemTop(),
			position: 'absolute',
		};
		var _className = 'item';
		if (this.props.index === this.props.activeIndex) {
			_className = 'item active';
		}
		var props = {
			className: _className,
			style: _style
		};
		return (
			<div {...props}>
				<div>{this.props.data}</div>
			</div>

		);

	}
}
