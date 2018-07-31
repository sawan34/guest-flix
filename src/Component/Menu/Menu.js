import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import { connect } from "react-redux";
import BaseOverlay from '../Overlay/BaseOevrlay';
import KeyMap from '../../constants/keymap.constant';
import {commonConstants} from '../../constants/common.constants'


var extMenu = "Exit Menu";
var upDownKeyTimeOut = null;
class Menu extends Component {
    constructor(){
        super();
        //initial setup of props and state
        this.state = {
			menuItems:[],
			showMenu:{display:false},
			scrollStyle:{transform:'translate3d(0,0,0)'},
			currIndex:0,
			activeMenu:""
		}
		
		this.onKeyDown= this.onKeyDown.bind(this);
	}
	
	/**
	 * This function creates the menu from mode (like adult,kid or hollywood)
	 * @param {object} metaData: contains the information about menu items 
	 */
	createMenuFromMode = (metaData) => {
		let modeMenu = [];
		if (metaData.modes && metaData.modes.length > 0) {
			let modesNo = this.uiConfigData.modes ? this.uiConfigData.modes.length : 0;
			let availableModeNo = metaData.modes.length;
			if (modesNo > 0) {
				for (var i = 0; i < modesNo; i++) {
					for (var j = 0; j < availableModeNo; j++) {
						if (this.uiConfigData.modes[i].id === metaData.modes[j]) {
							modeMenu.push(this.uiConfigData.modes[i].name)
						}
					}
				}
				// rendering mode related menu
				this.setState({
					menuItems: [...this.state.menuItems, ...modeMenu]
				});
			}
		}
	}

	/**
	 * This function creates the menu from grouping (like 2001,2002)
	 * @param {object} metaData: contains the information about menu items 
	 */
	createMenuFromGroup = (metaData) => {
		if (metaData.groupings && metaData.groupings.length > 0) {
			let groupNo = (this.props && this.props.getGroupings && this.props.getGroupings.message) ? this.props.getGroupings.message.data.length : 0;
			let availableGroupNo = metaData.groupings.length;
			var groupmenu = [];
			if (groupNo > 0) {
				for (var j = 0; j <availableGroupNo ; j++) {
					for (var i = 0; i < groupNo; i++) {
						if (this.props.getGroupings.message.data[i].id === metaData.groupings[j]) {
							groupmenu.push(this.props.getGroupings.message.data[i].label);
						}
					}
				}
				// rendering grouping related menu
				this.setState({
					menuItems: [...this.state.menuItems, ...groupmenu]
				});
				
			}
		}
	}

	/**
	 * This function creates the menu from attribute given in leftmenu (like filtering ,language)
	 * @param {object} metaData: contains the information about menu items 
	 */
	createMenuFromAttr = (metaData) => {
	 	if (metaData.languageEnabled) {
	 		this.setState({
	 			menuItems: [...this.state.menuItems, "Language"]
	 		});
	 	}
	 	if (metaData.filterEnabled) {
	 		this.setState({
	 			menuItems: [...this.state.menuItems, "Filter"]
	 		});
	 	}
	}

	/**
	 * This function makes default focus item in menu list (i.e exit menu)
	 * @param {object} none:
	 */
	focusDefaultMenu = () => {
		try {
			this.setState({
				activeMenu: extMenu,
				currIndex: this.state.menuItems.indexOf(extMenu)
			})
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
			this.setState({menuItems: [...this.state.menuItems, "Exit Menu"]}); 
			this.createMenuFromAttr(metaData);
			this.defaultMenuNo = this.state || this.state.menuItems ? this.state.menuItems.length : 5;
			this.createMenuFromGroup(metaData);
			this.focusDefaultMenu();
		}
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
	 * This function is making menu active and background as blurr
	 * @param {} null: 
	 */
	makeMenuActive = () => {
		localStorage.isMenuActive = true;
		let showOtherEle;
		showOtherEle = document.querySelector("div [data-show]");
		this.setState({
			showMenu: {
				display: true
			}
		});
	}

	getCurrentIndex = () => {
        var currMenuPos = null;
        if (this.state && this.state.menuItems && this.state.menuItems.length > 0) {
            currMenuPos = this.state.menuItems.indexOf(this.state.activeMenu);
        }
        return currMenuPos;
    }

	
    getGroupingInfo = () => {
        var currMenuPos = this.getCurrentIndex();
        var currGroupingId = null
        var totalAvailableGroup = this.props.getUiConfig.message.data.leftMenu.groupings
        if (currMenuPos + 1 > this.defaultMenuNo) {
            currGroupingId = totalAvailableGroup[currMenuPos - this.defaultMenuNo];
        }
        return currGroupingId;
    }

	onItemFocus = () => {
		try {

			//call the callback function when selected item is
			var currGroupingId = null;
			var groupObj = {};
			groupObj.type = commonConstants.MENU_DEFAULT_TYPE;
			groupObj.id = null;
			currGroupingId = this.getGroupingInfo();
			if (currGroupingId) {
				var groupObj
				groupObj.id = currGroupingId;
				groupObj.type = commonConstants.MENU_GROUPING_TYPE;
			}
			this.props.onFocus(groupObj);
		} catch (error) {

		}
	}

    onItemSelected = () => {
		//call the callback function when selected item is
		var currGroupingId = null;
		var groupObj = {};
		groupObj.type = commonConstants.MENU_DEFAULT_TYPE;
		groupObj.id = null;
        try {
            currGroupingId = this.getGroupingInfo();
            if (currGroupingId) {
				var groupObj
				groupObj.id = currGroupingId;
				groupObj.type = commonConstants.MENU_GROUPING_TYPE;
            }
			this.props.onItemSelect(groupObj);
        } catch (error) {

        }
    }


	/**
	 * This function is responsible for up or down movement for menu items
	 * @param {boolean} isDown: inidcates that the direction is down if true else up
	 * @param {number}  currentPos: 
	 */
	handleUpDown = (isDown, currentPos) => {
		let dirVal = 1;
		const currNode = ReactDOM.findDOMNode(this);
		if (isDown) {
			this.prevPos = (this.state.currIndex === currentPos) ? currentPos : this.state.currIndex ;
			currentPos = this.prevPos + 1;
			dirVal = -1;
		} else {
			this.prevPos = (this.state.currIndex === currentPos) ? currentPos : this.state.currIndex ;
			currentPos = this.prevPos - 1
		}
		let nextActivemenu = this.state.menuItems[currentPos];
		// here checking if last item is out of page
		let itemPos = 0,
			activeElem = null,
			menuHeight = 0,
			itemHeight = 0;
		activeElem = currNode.querySelector('.active');
		if(activeElem){
			itemHeight = Math.ceil(activeElem.scrollHeight);
		}
		let scrollNum = 1;
		var scrollStyle = {...this.state.scrollStyle};
		var lastIndex = 8;
		var nextIndex = (currentPos + 1) ;
		var menuElem = activeElem.parentElement;
		
		if(nextIndex > lastIndex && isDown){
			scrollNum = nextIndex - lastIndex;
			scrollStyle.transform = `translate3d(0,${itemHeight*dirVal*scrollNum}px,0)`;
		}else if(!isDown && menuElem && menuElem.style && menuElem.style.transform && this.prevPos > lastIndex - 1){
			var checkForPos = parseInt(activeElem.parentElement.style.transform.split(",")[1]);
			var yPos = 0;
			if(checkForPos < 0){
				checkForPos = checkForPos + itemHeight;
				scrollStyle.transform = `translate3d(0,${checkForPos}px,0)`;
			}
		}else{
			scrollStyle.transform = `translate3d(0,0,0)`;
		}

		if(upDownKeyTimeOut){
            clearTimeout(upDownKeyTimeOut)
        }
        upDownKeyTimeOut = setTimeout(function(){
            this.onItemFocus();
        }.bind(this),500);


		this.setState({
			activeMenu: nextActivemenu,
			currIndex:currentPos,
			scrollStyle:scrollStyle
		});
	}

	/**
	 * This function is responsible for menu item traversing
	 * @param {object} event: this object contains the keycode for traversing
	 */
	onKeyDown(event) {
		try {
			var keyCode = event.keyCode;
			var currentPos = null;
			currentPos = this.state.menuItems.indexOf(this.state.activeMenu);
			switch (keyCode) {
				case KeyMap.VK_ENTER:
				case KeyMap.VK_RIGHT:
					if(this.state.activeMenu === extMenu){
						this.setState({showMenu:{display:false}});
						var menuNode = ReactDOM.findDOMNode(this);
						document.removeEventListener("keydown", this.onKeyDown);
						localStorage.isMenuActive = false;
						this.props.changeMenuStatus(event);
					}else{
						document.removeEventListener("keydown", this.onKeyDown);						
                        this.onItemSelected();
                    }
					break;
				case KeyMap.VK_UP:
					
					if (currentPos === 0 || this.state.showMenu.display === 'none') {
						return;
					}
					this.handleUpDown(false,currentPos);
					break;
				case KeyMap.VK_DOWN:
					if (currentPos === this.state.menuItems.length-1 || this.state.showMenu.display === 'none') {
						return;
					}
					this.handleUpDown(true,currentPos);
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
    componentDidMount() {
    	//fetching the menu items
    	setTimeout(() => {
    		this.getMenuMetaData();
    		this.makeMenuActive();
    	}, 0);
    	document.addEventListener("keydown", this.onKeyDown);
    }

	componentWillUnmount(){
		document.removeEventListener("keydown", this.onKeyDown);
	}

	/**
	 * This function is responsible for rendering the menu UI eact time it get calls
	 * @param {} none: 
	 */
    render() {
		var submenuShow = {
			display:'none'
		}
		if(this.state.activeMenu && this.state.activeMenu.toLowerCase() !== extMenu.toLowerCase()){
			submenuShow.display = 'block';
		}

		var leftMenu = "left-menu hide";
		if(this.state.showMenu.display){
			leftMenu = "left-menu show";
		}
        return(
		<div className={leftMenu} >
			<div className="menu">
				<div className="logo"><img src={"images/logo-menu.jpg"} /></div>
				<nav className="scrollMenu">
					<ul style={this.state.scrollStyle}>
						{this.state.menuItems.map((item,i)=>{
							return (<li key={i+"id"} className={(i === this.state.currIndex)?"active":""}><a href="#">{item}<i className={(item && item.toLowerCase() === "exit menu")?"fa fa-caret-left":"fa fa-caret-right"} aria-hidden="true"></i></a></li>)
						})}
					</ul>
				</nav>
			</div>
			<BaseOverlay show={submenuShow}/>
		</div>
        )
    }
}

const mapStateToProps = state => ({
	getUiConfig:state.getUiConfig,
	getGroupings:state.getGroupings
});


//export default Menu;

export default connect(mapStateToProps)(Menu);
