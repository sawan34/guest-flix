/**
* Summary: Vertical Grid Component
* Description: This is Vertical Grid with infinite scrolling 
* @author Amit Singh Tomar
* @date  26.07.2018
*/
import React from 'react';
import PropTypes from 'prop-types';
import VerticalGridItem from './VerticalGriditem';
import KeyMap from '../../constants/keymap.constant';
import TvComponenet from '../TvComponent';
import COMMON_UTILITIES from '../../commonUtilities';

// Focus direction Constant
const FOCUS_DIRECTION = { "UP": "UP", "DOWN": "DOWN", "LEFT": "LEFT", "RIGHT": "RIGHT" }
const ANIM_TIME = 150

export default class VerticalGrid extends TvComponenet {

	/**
	* Description: React Inbuilt method for defining  the property types
	*@param {null} 
    * @return {object}
	*/
	static get propTypes() {
		return {
			itemClassName: PropTypes.string,
			entries: PropTypes.arrayOf(PropTypes.object).isRequired,
			height: PropTypes.number,
			width: PropTypes.number,
			padding: PropTypes.number,
			wrapperHeight: PropTypes.number,
			wrapperWidth: PropTypes.number,
			lazyCallback: PropTypes.func,
			focusCallback: PropTypes.func,
			renderRangeCallback: PropTypes.func,
			buffer: PropTypes.number,
			enterPressed: PropTypes.func
		}
	}

	/**
     * Description: This Method intialize state object
	 *@param {null} 
     * @return {object}
   */
	initialState() {
		return {
			initiatedLazyload: false,
			minHeight: window.innerHeight * 2,
			minItemIndex: 0,
			maxItemIndex: 100,
			activeIndex: 0,
			focusLostItemPosition: -1,
			scrollY: 0,
			isActive: false,
			itemDimensions: {
				height: this._itemHeight(),
				width: this._itemWidth(),
				gridWidth: 0,
				itemsPerRow: 2,
			},
		};
	}

	/**
	* Description: class initialization, set initial properties while instanciating
	* @param {object} 
	* @return {null}
	*/
	constructor(props) {
		super(props);
		this.state = this.initialState();
		// bind the functions
		this._scrollListener = this._scrollListener.bind(this);
		this._updateItemDimensions = this._updateItemDimensions.bind(this);
		this._visibleIndexes = this._visibleIndexes.bind(this);
		this.handleKeyPress = this.handleKeyPress.bind(this);
		this.focusDefaultItem = this.focusDefaultItem.bind(this);

		//Variables
		this.scrollAfterIndex = 0;
		this.dateObj = new Date();
		this.keyPressTime = this.dateObj.getTime();

	}

	/**
	 * This function makes default focus item in menu list (i.e exit menu)\
	 * @param {null} 
     * @return {null}
	 */
	focusDefaultItem() {
		this.setState({ activeIndex: 0 })
	}


	/**
	 * Description: this method return style for verical grid cointainer
	 * @param {null} 
     * @return {object} 
	 */
	_wrapperStyle() {
		return {
			maxHeight: this._getGridHeight(),
			overflowY: 'hidden',
			height: this.props.data.wrapperHeight,
			col: this.props.data.coloumns,
		};
	}

	/**
	 * Description: this method return style for verical grid 
	 * @param {null} 
     * @return {object} 
	 */
	_gridStyle() {
		return {
			position: 'relative',
			marginTop: (this.props.data.padding || this.props.padding),
			marginLeft: (this.props.data.padding || this.props.padding),
			minHeight: this._getGridHeight(),
			transform: "translate3d(0px," + this.state.scrollY + "px,0)",
			transition: 'all ' + ANIM_TIME + 'ms ease-in-out'
		};
	}

	/**
	 * Description: this method return object with eight properties: 
	 * left, top, right, bottom, x, y, width, height of vertical grid
	 * @param {null} 
     * @return {object} 
	 */
	_getGridRect() {
		return this.refs.grid.getBoundingClientRect();
	}

	/**
	 * Description: this method return height of verical grid 
	 * @param {null} 
	 * @returns {integer}
	 */
	_getGridHeight() {
		return (this.props.data.entries.length < this.state.itemDimensions.itemsPerRow) ?
			this.state.itemDimensions.height :
			Math.ceil(this.props.data.entries.length / this.state.itemDimensions.itemsPerRow) * this.state.itemDimensions.height;
	}

	/**
	 * Description: this method return object with eight properties: 
	 * left, top, right, bottom, x, y, width, height of vertical grid wrapper
	 * @param {null} 
     * @return {object}
	 */
	_getWrapperRect() {
		return this.refs.wrapper.getBoundingClientRect();
	}

	/**
	 * Description: this method get index of minimum visible item and max visible item
	 * @param {null}
	 * @returns {null}
	 */
	_visibleIndexes() {
		var itemsPerRow = this._itemsPerRow();

		// The number of rows that the user has scrolled past
		var scrolledPast = (this._scrolledPastRows() * itemsPerRow);
		if (scrolledPast < 0) scrolledPast = 0;

		// If i have scrolled past 20 items, but 60 are visible on screen,
		// we do not want to change the minimum
		var min = scrolledPast - itemsPerRow;
		if (min < 0) min = 0;

		// the maximum should be the number of items scrolled past, plus some
		// buffer
		var bufferRows = this._numVisibleRows() + (this.props.data.buffer || this.props.buffer);
		var max = scrolledPast + (itemsPerRow * bufferRows);
		if (max > this.props.data.entries.length) max = this.props.data.entries.length;

		this.setState({
			minItemIndex: min,
			maxItemIndex: max,
		}, function () {
			this._lazyCallback();
		});
	}

	/**
	 * Description: this method update grid item params
	 * @param {null}
	 * @returns {null}
	 */
	_updateItemDimensions() {
		this.setState({
			itemDimensions: {
				height: this._itemHeight(),
				width: this._itemWidth(),
				gridWidth: this._getGridRect().width,
				itemsPerRow: this._itemsPerRow(),
			},
			minHeight: this._totalRows(),
		});
	}

	/**
	 * Description: this method return item per row
	 * @param {null}
	 * @returns {integer} this.props.data.coloumns
	 */
	_itemsPerRow() {
		return this.props.data.coloumns;
	}

	/**
	 * Description: this method return total rows
	 * @param {null}
	 * @returns {integer} 
	 */
	_totalRows() {
		const scrolledPastHeight = (this.props.data.entries.length / this._itemsPerRow()) * this._itemHeight();
		if (scrolledPastHeight < 0) return 0;
		return scrolledPastHeight;
	}

	/**
	 * Description: this method return rows scrolled
	 * @param {null}
	 * @returns {integer} 
	 */
	_scrolledPastRows() {
		const rect = this._getGridRect();
		const topScrollOffset = rect.height - rect.bottom;
		return Math.floor(topScrollOffset / this._itemHeight());
	}

	/**
	 * Description: this method return grid item height
	 * @param {null}
	 * @returns {integer} 
	 */
	_itemHeight() {
		return (this.props.data.itemHeight || this.props.itemHeight) + (2 * (this.props.data.paddingBottom || this.props.paddingBottom));
	}

	/**
	 * Description: this method return grid item width
	 * @param {null}
	 * @returns {integer} 
	 */
	_itemWidth() {
		return (this.props.data.itemWidth || this.props.itemWidth) + (2 * (this.props.data.paddingLeft || this.props.paddingLeft));
	}

	/**
	 * Description: this method return number of visible rows
	 * @param {null}
	 * @returns {integer} 
	 */
	_numVisibleRows() {
		return parseInt(this._getWrapperRect().height / this._itemHeight(), 10);
	}

	/**
	 * Description: this method is a callback method 
	 * @param {null}
	 * @returns {null} 
	 */
	_lazyCallback() {
		if (!this.state.initiatedLazyload && (this.state.maxItemIndex === this.props.data.entries.length) && this.props.data.lazyCallback) {
			this.setState({ initiatedLazyload: true });
			this.props.data.lazyCallback(this.state.maxItemIndex);
		}
	}

	componentDidMount() {
		super.componentDidMount();
		this._updateItemDimensions();
		this._visibleIndexes();
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.entries.length > this.props.data.entries.length) {
			this.setState({
				initiatedLazyload: false,
			});
		}
		this._visibleIndexes();
	}

	componentDidUpdate(prevProps, prevState) {

		if (typeof this.props.data.renderRangeCallback === 'function') {
			this.props.data.renderRangeCallback(this.state.minItemIndex, this.state.maxItemIndex);
		}
	}

	// LISTENERS

	/**
	 * Description: this method check the scrolling offset
	 * @param {null}
	 * @returns {null} 
	 */
	_scrollListener() {
		this.scrollOffset = this._visibleIndexes();
	}

	/**
	 * This function is responsible for grid item traversing
	 * @param {object} event: this object contains the keycode for traversing
	 * @returns {null}
	 */
	handleKeyPress = (event) => {
		var currentIndex = this.state.activeIndex;
		var currentScroll = 0;
		try {
			var keyCode = event.keyCode;
			switch (keyCode) {
				case KeyMap.VK_UP:
					this.scrollAfterIndex = this._itemsPerRow() * (this._numVisibleRows() - 1);
					currentIndex = currentIndex - this._itemsPerRow();
					if (currentIndex >= 0) {
						if ((currentIndex + 1) > this.scrollAfterIndex) {
							currentScroll = this.state.scrollY + this._itemHeight();
							this.setState((prevState) => {
								return { activeIndex: currentIndex, scrollY: currentScroll }
							});
							this._scrollListener();
						} else {
							this.setState((prevState) => {
								return { activeIndex: currentIndex, scrollY: currentScroll }
							});
						}
					} else {
						this.props.data.FocusCallback(FOCUS_DIRECTION.UP);
					}
					break;
				case KeyMap.VK_LEFT:
					this.scrollAfterIndex = this._itemsPerRow() * (this._numVisibleRows() - 1);
					var isFirstElementofRow = (((currentIndex + 1) % (this._itemsPerRow())) === 1) ? true : false;
					currentIndex = currentIndex - 1;
					if (currentIndex >= 0) {
						if (isFirstElementofRow) {
							if ((currentIndex + 1) > this.scrollAfterIndex) {
								currentScroll = this.state.scrollY + this._itemHeight();
								this.setState((prevState) => {
									return { activeIndex: currentIndex, scrollY: currentScroll }
								});
								this._scrollListener();
							} else {
								this.setState((prevState) => {
									return { activeIndex: currentIndex, scrollY: currentScroll }
								});
							}

						} else {
							this.setState((prevState) => {
								return { activeIndex: currentIndex }
							});
						}
					} else {
						this.props.data.FocusCallback(FOCUS_DIRECTION.LEFT);
					}
					break;
				case KeyMap.VK_RIGHT:
					var isLastElementofRow = ((currentIndex + 1) % (this._itemsPerRow()) === 0) ? true : false;
					this.scrollAfterIndex = this._itemsPerRow() * this._numVisibleRows();
					currentIndex = currentIndex + 1;
					if (currentIndex >= 0 && currentIndex < this.props.data.entries.length) {
						if (isLastElementofRow) {
							if ((currentIndex + 1) > this.scrollAfterIndex) {
								currentScroll = this.state.scrollY - this._itemHeight();
								this.setState((prevState) => {
									return { activeIndex: currentIndex, scrollY: currentScroll }
								});
								this._scrollListener();
							} else {
								this.setState((prevState) => {
									return { activeIndex: currentIndex }
								});
							}
						} else {
							this.setState((prevState) => {
								return { activeIndex: currentIndex }
							});
						}
					} else {
						this.props.data.FocusCallback(FOCUS_DIRECTION.RIGHT);
					}
					break;
				case KeyMap.VK_DOWN:
					this.scrollAfterIndex = this._itemsPerRow() * this._numVisibleRows();
					currentIndex = currentIndex + this._itemsPerRow();
					if (currentIndex < this.props.data.entries.length) {
						if ((currentIndex + 1) > this.scrollAfterIndex) {
							currentScroll = this.state.scrollY - this._itemHeight();
							this.setState((prevState) => {
								return { activeIndex: currentIndex, scrollY: currentScroll }
							});
							this._scrollListener();
						} else {
							this.setState((prevState) => {
								return { activeIndex: currentIndex }
							});
						}
					} else {
						var isNextRowPresent = true;
						currentIndex = currentIndex - this._itemsPerRow();
						var noOfElementRemaining = ((currentIndex + 1) % (this._itemsPerRow()) === 0) ? 0 : (this._itemsPerRow() - ((currentIndex) + 1) % (this._itemsPerRow()));
						var lastElementIndex = (currentIndex + noOfElementRemaining) > (this.props.data.entries.length - 1) ? this.props.data.entries.length - 1 : (currentIndex + noOfElementRemaining);
						if (lastElementIndex === (this.props.data.entries.length - 1)) {
							isNextRowPresent = false;
						}


						if (isNextRowPresent) {
							currentIndex = this.props.data.entries.length - 1;
							if ((currentIndex + 1) > this.scrollAfterIndex) {
								currentScroll = this.state.scrollY - this._itemHeight();
								this.setState((prevState) => {
									return { activeIndex: currentIndex, scrollY: currentScroll }
								});
								this._scrollListener();
							} else {
								this.setState((prevState) => {
									return { activeIndex: currentIndex }
								});
							}
						} else {
							this.props.data.FocusCallback(FOCUS_DIRECTION.DOWN);
						}
					}
					break;
				case KeyMap.VK_ENTER:
					this.props.data.enterPressed(this.state.activeIndex);
					break;
				case KeyMap.VK_BACK:
					if (typeof (this.props.onBackKeyPressed) === "function") {
						this.props.onBackKeyPressed();
					}
					break;
				default:
					break;
			}
		} catch (e) {
		}

		//this.props.focusedItemIndex(this.state.activeIndex);
	}


	focus() {
		super.focus();
		this.setState({ isActive: true });
	}

	deFocus() {
		super.deFocus();
		this.setState({ isActive: false });
	}

	// RENDER
	render() {
		var CurrentItemFocused = -1;

		if (this.state.isActive) {
			CurrentItemFocused = this.state.activeIndex;
		} else {
			CurrentItemFocused = -1;
		}

		var entries = [];
		// if no entries exist, there's nothing left to do
		if (!this.props.data.entries.length) {
			return null;
		}
		for (let i = this.state.minItemIndex; i <= this.state.maxItemIndex; i++) {
			let entry = this.props.data.entries[i];
			if (!entry) {
				continue;
			}
			var itemIndex = (i + 1) % this._itemsPerRow();
			const itemProps = {
				key: 'item-' + i,
				index: i,
				paddingLeft: (this.props.data.paddingLeft || this.props.paddingLeft),
				paddingBottom: (this.props.data.paddingBottom || this.props.paddingBottom),
				dimensions: this.state.itemDimensions,
				data: entry,
				itemPos: itemIndex,
				activeIndex: CurrentItemFocused
			};
			entries.push(<VerticalGridItem {...itemProps} />);
		}
		return (
			<div className='Vertical-grid-wrapper faded-bottom' ref='wrapper' style={this._wrapperStyle()}>
				<div ref='grid' className='Vertical-grid' style={this._gridStyle()}>
					{entries}
				</div>
			</div>
		);
	}
};


VerticalGrid.defaultProps = {
	buffer: 4,
	paddingLeft: 5,
	paddingBottom: 5,
	entries: [],
	itemHeight: 250,
	itemWidth: 250,
	col: 3,
	gridClass: 'Vertical-grid',
	gridItemClass: 'Vertical-grid-item',
	activeEvent: false
}
