import React, {Component} from 'react';
import { connect } from "react-redux";
import KeyMap from '../../constants/keymap.constant';


class Menu extends Component {
    constructor(){
        super();
        //initial setup of props and state
        this.state = {
			menuItems:[],
			showMenu:{display:"none"},
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
				for (var i = 0; i < groupNo; i++) {
					for (var j = 0; j < availableGroupNo; j++) {
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
	focusDefaultMenu = ()=>{
		this.setState({activeMenu:"Exit Menu"})
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
		if (showOtherEle) {
			showOtherEle.classList.add('bluureffects');
		}
		this.setState({
			showMenu: {
				display: 'block'
			}
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
			var nextActivemenu = null;
			currentPos = this.state.menuItems.indexOf(this.state.activeMenu);
			switch (keyCode) {
				case KeyMap.VK_ENTER:
					if(this.state.activeMenu === "Exit Menu"){
						localStorage.isMenuActive = false;
						this.setState({showMenu:{display:'none'}});
						let showOtherEle;
						showOtherEle= document.querySelector("div [data-show]");
						showOtherEle.classList.remove('bluureffects');
						document.removeEventListener("keydown", this.onKeyDown);
						this.props.changeMenuStatus(event);
					}
					break;
				case KeyMap.VK_1:
					this.makeMenuActive();
					break;
				case KeyMap.VK_UP:
					
					if (currentPos === 0 || this.state.showMenu.display === 'none') {
						return;
					}
					currentPos = currentPos - 1;
					nextActivemenu = this.state.menuItems[currentPos];
					this.setState({
						activeMenu: nextActivemenu
					});
					break;
				case KeyMap.VK_DOWN:
					if (currentPos === this.state.menuItems.length-1 || this.state.showMenu.display === 'none') {
						return;
					}
					currentPos = currentPos + 1;
					nextActivemenu = this.state.menuItems[currentPos];
					this.setState({
						activeMenu: nextActivemenu
					});
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
		if(this.state.activeMenu && this.state.activeMenu.toLowerCase() !== "exit menu"){
			submenuShow.display = 'block';
		}
        return(
		<div className="left-menu" style={this.state.showMenu}>
			<div className="menu">
				<div className="logo"><img src={"../../../images/logo-menu.jpg"} /></div>
				<nav>
					<ul>
						{this.state.menuItems.map((item)=>{
							return (<li key={item+"id"} className={(item === this.state.activeMenu)?"active":""}><a href="#">{item}<i className={(item && item.toLowerCase() === "exit menu")?"fa fa-caret-left":"fa fa-caret-right"} aria-hidden="true"></i></a></li>)
						})}
					</ul>
				</nav>
			</div>
			<div className="sub-menu" style={submenuShow}>
				<div className="movie-list">
					<ul>
					</ul>
				</div>
			</div>
		</div>
        )
    }
}
//export default  Menu;

const mapStateToProps = state => ({
	getUiConfig:state.getUiConfig,
	getGroupings:state.getGroupings
  });
  


export default connect(mapStateToProps)(Menu);