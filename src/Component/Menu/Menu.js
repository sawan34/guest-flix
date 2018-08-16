import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from "react-redux";
import { Trans } from 'react-i18next';
import KeyMap from '../../constants/keymap.constant';
import { commonConstants } from '../../constants/common.constants'
import TvComponent from '../TvComponent';
import COMMON_UTILITIES from '../../commonUtilities';

const MENU_TYPE = {
	FILTER: 'filter',
	LANGUAGE: 'language',
	MODE: 'mode',
	GROUPING: 'grouping',
	EXIT: 'exit'
};
var upDownKeyTimeOut = null;
class Menu extends TvComponent {
	constructor() {
		super();
		//initial setup of props and state
		this.state = {
			menuItems: [],
			scrollStyle: { transform: 'translate3d(0,0,0)' },
			currIndex: 0,
		}
		this.exitPos = 0;
		this.lastActiveItemIndex = 0;
		this.onKeyDown = this.onKeyDown.bind(this);
	}

	/**
	 * This function creates the menu from mode (like adult,kid or hollywood)
	 * @param {object} metaData: contains the information about menu items 
	 */
	createMenuFromMode = (metaData) => {
		if (metaData.modes && metaData.modes.length > 0) {
			let modesNo = this.uiConfigData.modes ? this.uiConfigData.modes.length : 0;
			let availableModeNo = metaData.modes.length;
			if (modesNo > 0) {
				for (var i = 0; i < availableModeNo; i++) {
					for (var j = 0; j < availableModeNo; j++) {
						if (this.uiConfigData.modes[i].id === metaData.modes[j]) {
							if (!COMMON_UTILITIES.isEmptyObject(this.uiConfigData.modes[i])) {
								var tempOBJ = Object.assign({}, this.uiConfigData.modes[i]);
								tempOBJ.label = this.uiConfigData.modes[i].i8nLabel;
								this.defineMenuType(MENU_TYPE.MODE, tempOBJ);
								this.state.menuItems.push(tempOBJ);
								break;
							}
						}
					}
				}
			}
		}
	}

	/**
	 * This function creates the menu from grouping (like 2001,2002)
	 * @param {object} metaData: contains the information about menu items 
	 */
	//done removed unwanted code
	createMenuFromGroup = (metaData) => {
		if (metaData.groupings && metaData.groupings.length > 0) {
			let groupNo = (this.props && this.props.getGroupings && this.props.getGroupings.message) ? this.props.getGroupings.message.data.length : 0;
			let availableGroupNo = metaData.groupings.length;
			if (groupNo > 0) {
				for (var j = 0; j < availableGroupNo; j++) {
					for (var i = 0; i < groupNo; i++) {
						if (this.props.getGroupings.message.data[i].id === metaData.groupings[j]) {
							if (!COMMON_UTILITIES.isEmptyObject(this.props.getGroupings.message.data[i])) {
								var tempOBJ = Object.assign({}, this.props.getGroupings.message.data[i]);
								this.defineMenuType(MENU_TYPE.GROUPING, tempOBJ);
								this.state.menuItems.push(tempOBJ);
								break;
							}
						}
					}
				}
			}
		}
	}

	/**
	 * This function creates the menu from attribute given in leftmenu (like filtering ,language)
	 * @param {object} metaData: contains the information about menu items 
	 */
	createMenuFromAttr = (metaData) => {
		var tempOBJ = {};
		if (metaData.languageEnabled) {
			tempOBJ = {};
			tempOBJ.label = commonConstants.MENU_LANGUAGE;
			this.defineMenuType(MENU_TYPE.LANGUAGE, tempOBJ);
			this.state.menuItems.push(tempOBJ);
		}
		if (metaData.filterEnabled) {
			tempOBJ = {};
			tempOBJ.label = commonConstants.MENU_FILTER;
			this.defineMenuType(MENU_TYPE.FILTER, tempOBJ);
			this.state.menuItems.push(tempOBJ);
		}
	}

	defineMenuType = (menuName, obj) => {
		obj.isMode = false;
		obj.isGrouping = false;
		obj.isExit = false;
		obj.isFilter = false;
		obj.isLanguage = false;
		switch (menuName) {
			case MENU_TYPE.MODE:
				obj.isMode = true;
				break;
			case MENU_TYPE.GROUPING:
				obj.isGrouping = true;
				break;
			case MENU_TYPE.FILTER:
				obj.isFilter = true;
				break;
			case MENU_TYPE.LANGUAGE:
				obj.isLanguage = true;
				break;
			case MENU_TYPE.EXIT:
				obj.isExit = true;
				break;
		}
	}
	/**
	 * This function makes default focus item in menu list (i.e exit menu)
	 * @param {object} none:
	 */
	focusDefaultMenu = () => {
		try {
			this.state.currIndex = this.exitPos;
			this.focus();
		} catch (error) {

		}
	}

	/**
	 * This function makes menu items with the help of three different action inside it 
	 * @param {objetct} metaData : contains the information about menu items 
	 */
	createMenuItem = (metaData) => {
		if (metaData) {
			//creating the menus from data in order 
			this.createMenuFromMode(metaData);
			this.createExitMenuItem();
			this.createMenuFromAttr(metaData);
			this.defaultMenuNo = this.state || this.state.menuItems ? this.state.menuItems.length : 5;
			this.createMenuFromGroup(metaData);
			this.focusDefaultMenu();
		}
	}

	/**
	 * This function creates the exit menu item
	 */
	createExitMenuItem = () => {
		this.exitPos = this.state.menuItems.length;
		var tempOBJ = {};
		tempOBJ.label = commonConstants.MENU_EXIT;
		this.defineMenuType(MENU_TYPE.EXIT, tempOBJ);
		this.state.menuItems.push(tempOBJ);
	}

	/**
	 * This function is responsible for getting the menu information through server call
	 * @param {none} : 
	 */
	getMenuMetaData = () => {
		let getResponse = this.props.getUiConfig;
		if (getResponse && getResponse.message && getResponse.message.data) {
			var menuMetadata = getResponse.message.data.leftMenu;
			this.uiConfigData = getResponse.message.data;
			this.createMenuItem(menuMetadata);
		}
	}

	/**
	 * This function is responsible for creating the information for focused item in menu
	 * @param {} none:
	 * @return {obj} groupingObj: contains the information about the focused or selected item
	    in menu list.
	 */
	getCurrentActiveMenuInfo = () => {
		return this.state.menuItems[this.state.currIndex];
	}

	/**
	 * This function is gets execute whenever user select or focus any item in menu list
	 * @param {} none:
	 * @return none
	 */
	onItemActive = (itemFocused) => {
		//call the callback function when selected item is
		try {
			var menuItemObj = this.getCurrentActiveMenuInfo();
			if (!COMMON_UTILITIES.isEmptyObject(menuItemObj)) {
				if (itemFocused) {
					this.props.onFocus(menuItemObj);
				} else {
					this.deFocus();
					this.props.onItemSelect(menuItemObj);
				}
			}
		} catch (error) {

		}
	}

	/**
	 * This function is responsible for defocusing the current item in menu
	 * @param {} none: 
	 * @param {}  none: 
	 */
	deFocus = () => {
		super.deFocus();
		this.lastActiveItemIndex = this.state.currIndex;
		this.setState({
			currIndex: null
		});
	}

	/**
	 * This function is responsible for focusing back the current item in menu
	 * @param {} none: 
	 * @param {}  none:
	 */
	//need to work
	focus = () => {
		super.focus();
		var currentPos = this.state.currIndex || this.lastActiveItemIndex || null;
		this.setState({
			currIndex: currentPos
		});
	}

	/**
	 * This function is responsible for up or down movement for menu items
	 * @param {boolean} isDown: inidcates that the direction is down if true else up
	 * @param {number}  currentPos: 
	 */
	handleUpDown = (isDown, currentPos) => {
		let dirVal = 1;
		const CURRENT_NODE = ReactDOM.findDOMNode(this);
		if (isDown) {
			currentPos = currentPos + 1;
			dirVal = -1;
		} else {
			currentPos = currentPos - 1
		}
		let activeElem = null,
			itemHeight = 0;
		activeElem = CURRENT_NODE.querySelector('.active');
		if (activeElem) {
			itemHeight = Math.ceil(activeElem.scrollHeight);
		}
		let scrollNum = 1;
		var scrollStyle = { ...this.state.scrollStyle };
		var lastIndex = 8;
		var nextIndex = (currentPos + 1);
		var menuElem = activeElem.parentElement;
		if (nextIndex > lastIndex && isDown) {
			scrollNum = nextIndex - lastIndex;
			scrollStyle.transform = `translate3d(0,${itemHeight * dirVal * scrollNum}px,0)`;
		} else if (!isDown && menuElem && menuElem.style && menuElem.style.transform && this.prevPos > lastIndex - 1) {
			var checkForPos = parseInt(activeElem.parentElement.style.transform.split(",")[1]);
			if (checkForPos < 0) {
				checkForPos = checkForPos + itemHeight;
				scrollStyle.transform = `translate3d(0,${checkForPos}px,0)`;
			}
		} else {
			scrollStyle.transform = `translate3d(0,0,0)`;
		}
		this.setState({
			currIndex: currentPos,
			scrollStyle: scrollStyle
		});
		if (this.state.menuItems[this.state.currIndex].isGrouping) {
			if (upDownKeyTimeOut) {
				clearTimeout(upDownKeyTimeOut)
			}
			upDownKeyTimeOut = setTimeout(function () {
				this.onItemActive(true);
			}.bind(this), 500);
		} else {
			this.onItemActive(true);
		}
	}

	/**
	 * This function is responsible for menu item traversing
	 * @param {object} event: this object contains the keycode for traversing
	 */
	handleKeyPress(event) {
		try {
			var keyCode = event.keyCode;
			var currentPos = null;
			currentPos = this.state.currIndex;
			switch (keyCode) {
				case KeyMap.VK_ENTER:
				case KeyMap.VK_RIGHT:
					if (this.state.menuItems[currentPos].isExit) {
						this.props.changeMenuStatus(event);
					} else {
						this.onItemActive(false);
					}
					break;
				case KeyMap.VK_UP:
					if (currentPos === 0) {
						return;
					}
					this.handleUpDown(false, currentPos);
					break;
				case KeyMap.VK_DOWN:
					if (currentPos === this.state.menuItems.length - 1) {
						return;
					}
					this.handleUpDown(true, currentPos);
					break;
				default:
					break;
			}
		} catch (e) {

		}
	}

	/**
	 * This function is responsible for calling the server action and binding the key action
	 * @param {} none: 
	 */
	// need to work on
	componentDidMount() {
		super.componentDidMount();
		this.getMenuMetaData();
	}

	/**
	 * This function is responsible for rendering the menu UI eact time it get calls
	 * @param {} none: 
	 */
	render() {
		var leftMenu = "left-menu show";
		return (
			<div className={leftMenu} >
				<div className="menu">
					<div className="logo"><img src={"images/logo-menu.jpg"} /></div>
					<nav className="scrollMenu">
						<ul style={this.state.scrollStyle}>
							{this.state.menuItems.map((item, i) => {
								var listClassName = "";
								var modeStyle = "";
								if (item.isMode) {
									modeStyle = "modeGrey ";
								} else if (item.isExit) {
									modeStyle = "exit ";
								}
								if (i === this.state.currIndex) {
									listClassName = "active ";
								}
								return (<li key={i + "id"} className={listClassName + modeStyle}><a href="#">
									<Trans i18nKey={item.label.toLowerCase()}>{item.label}</Trans>
									<i className={(item.label && item.isExit) ? "fa fa-caret-left" : "fa fa-caret-right"} aria-hidden="true"></i></a></li>)
							})}
						</ul>
					</nav>
				</div>
			</div>
		)
	}
}

const mapStateToProps = state => ({
	getUiConfig: state.getUiConfig,
	getGroupings: state.getGroupings
});

//export default Menu;
export default connect(mapStateToProps)(Menu);
