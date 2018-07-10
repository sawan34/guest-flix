import React, {Component} from 'react';
import Method from '../../services/services';
import API_INTERFACE from '../../constants/uri.constant';
import {responseActions} from '../../actions/response.actions';
import KeyMap from '../../constants/keymap'


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
		if (metaData.modes && metaData.modes.length > 0) {
			let modesNo = this.uiConfigData.modes ? this.uiConfigData.modes.length : 0;
			let availableModeNo = metaData.modes.length;
			if (modesNo > 0) {
				for (var i = 0; i < modesNo; i++) {
					for (var j = 0; j < availableModeNo; j++) {
						if (this.uiConfigData.modes[i].id === metaData.modes[j]) {
							this.setState({
								menuItems: [...this.state.menuItems, this.uiConfigData.modes[i].name]
							});
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
	createMenuFromGroup = (metaData) => {
		if (metaData.groupings) {
			let menuGroupings = metaData.groupings;
			this.menuItems = [];
			var count = menuGroupings.length;
			for (let i = 0; i < count; i++) {
				Method.get(API_INTERFACE.GROUPINGS + "/" + menuGroupings[i], "").then(
					response => {
						if (response && response.data && response.data.label) {
							if (this.state && this.state.menuItems) {
								this.setState({
									menuItems: [...this.state.menuItems, response.data.label]
								})
							}
						}
					}
				)
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
    	Method.get(API_INTERFACE.UI_CONFIG, "").then(
    		response => {
    			let getResponse = responseActions.response(response);
    			if (getResponse && getResponse.message && getResponse.message.data) {
    				var menuMetadata = getResponse.message.data.leftMenu;
    				this.uiConfigData = getResponse.message.data;
    				this.createMenuItem.call(this, menuMetadata);
    				return getResponse;
    			}
    		}
		)
		/**
		 @to do: reducer state need to handle instead of making server call
		 **/
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
					    this.props.changeMenuStatus(event);
					}
					break;
				case KeyMap.VK_1:
					localStorage.isMenuActive = true;
					let showOtherEle;
					showOtherEle= document.querySelector("div [data-show]");
					if(showOtherEle){
					showOtherEle.classList.add('bluureffects');
					}
					this.setState({showMenu:{display:'block'}});
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
    componentDidMount(){
        //fetching the menu items
		this.getMenuMetaData();
		document.addEventListener("keydown", this.onKeyDown);
	}

	componentDidUpdate(){
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
		if(this.state.activeMenu.toLowerCase() !== "exit menu"){
			submenuShow.display = 'block';
		}
        return(
		<div className="left-menu" style={this.state.showMenu}>
			<div className="menu">
				<div className="logo"><img src={"../../../images/logo-menu.jpg"} /></div>
				<nav>
					<ul>
						{this.state.menuItems.map((item)=>{
							return (<li key={Math.random()+"id"} className={(item === this.state.activeMenu)?"active":""}><a href="#">{item}<i className={(item.toLowerCase() === "exit menu")?"fa fa-caret-left":"fa fa-caret-right"} aria-hidden="true"></i></a></li>)
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
export default  Menu;