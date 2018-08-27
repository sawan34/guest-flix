/**
* Summary: Home Screen Component
* Description: This is home screen created by extending base Screen
* @author Sawan Kumar
* @date  22.06.2018
*/

//external Libraries 
import React from 'react';
import { Trans } from 'react-i18next';
//screens
import BaseScreen, { invokeConnect } from './BaseScreen';
//constants
import { SCREENS } from '../../constants/screens.constant';
import { alertConstants } from '../../constants/alert.constant';
import roomUser from '../../services/service.roomUser';
//common uitilities
import Utilities from '../../commonUtilities';
//Actions
import { actionGetUserPreferences, actionSaveUserPreferences } from '../../actions/action.userPreferences';
import { actionGetBoookmarks } from '../../actions/action.bookmark';
import { actionRefreshtSelectables } from '../../actions';
//Other Components
import Menu from '../../Component/Menu/Menu';
import Selectables from '../../Component/Menu/Groupings/Selectables';
import MenuLanguage from '../../Component/Menu/Language/Language';
import BaseOverlay from '../../Component/Overlay/BaseOevrlay';
import MenuFilter from '../../Component/Menu/Filter/Filter';
import GroupingGrid from '../../Component/Grids/GroupingGrid';

class Home extends BaseScreen {
    constructor() {
        super();
        this.state = {
            ...this.state,
            screen: SCREENS.home,//This is mandatory for all the screens 
            reload: true,
            menuOn: false,
            timeInterval: 0,
            selectableOn: false,
            selectableActive: false,
            groupingID: 0,
            isMenuLanguageOn: false, //true when menu got focus
            isSubMenuActive: false, //true when menu got selected
            isMenuFilterOn: false, //true when menu filter got focus
            modeOverLayActive: false,
            homeGridObj: {}
        }
        this.stayId = "";
        this.isFilterValueChange = false;
        this.renderHome = this.renderHome.bind(this);
        this.renderSeletable = this.renderSeletable.bind(this);
        this.toggleHomeSelectable = this.toggleHomeSelectable.bind(this);
        this.onSelectMenuGrouping = this.onSelectMenuGrouping.bind(this);
        this.showSelectable = this.showSelectable.bind(this);
        this.selectableItemClicked = this.selectableItemClicked.bind(this);
        this.changeSubMenuActiveStatus = this.changeSubMenuActiveStatus.bind(this);
        this.removeSubMenu = this.removeSubMenu.bind(this);
        this.filterChangeStatus = this.filterChangeStatus.bind(this);
        this.changeMenuStatus = this.changeMenuStatus.bind(this);
        this.getHomeGroupingData = this.getHomeGroupingData.bind(this);
        this.onEnterPress = this.onEnterPress.bind(this);
    }

    componentDidMount() {
        //call for bookmarks
        this.stayId = roomUser.getStayId();
        this.props.actionGetBoookmarks(this.stayId);
        //call User Preferences
        this.props.actionGetUserPreferences(this.stayId);

    }

    /**
     * Description:Setting  Menu status On || Off 
     */
    changeMenuStatus() {
        if (!Utilities.isEmptyObject(this.menuComponent)) {
            if (this.menuComponent.isFocused()) {
                if (!this.state.selectableOn) {
                    this.groupingGrid.focus();
                }
            }
        }
        this.setState(prevState => {
            return { menuOn: !prevState.menuOn }
        }, () => { //reload if change in filter
            if (!this.state.menuOn && this.isFilterValueChange) {
                this.isFilterValueChange = false;
                let mode;
                try {
                    mode = this.props.reducerUiConfig.message.data.currentMode;
                } catch (e) {
                    mode = '';
                }
                this.props.actionRefreshtSelectables();
                this.goToScreen(SCREENS.dataloading + "/?mode=" + mode, null);
            }
        });
    }

    componentDidUpdate() {
        if (!this.state.menuOn && this.state.selectableOn) {
            if (!Utilities.isEmptyObject(this.gridSelectables)) {
                this.gridSelectables.focus();
            }
        }
    }

    /**
    * Description: This method store the grouping grid state object in home page state object
    * @param {object} stateObj
    */
    getHomeGroupingData(stateObj) {
        this.state.homeGridObj = stateObj;
    }

    /**
    * Description: This is a callback method for enter key pressed on grouping grid page.
    * this method redirect to program detail page
    * @param {integer} programId
    */
    onEnterPress(programId) {
        this.goToScreen(SCREENS.programdetails + "/" + programId, null);
    }

    /**
    * Description: This method return jsx for grouping grid
    * @param {null}  
    * @return {JSX}
    */
    renderHome() {
        return <GroupingGrid onEnterPress={this.onEnterPress} onRef={instance => (this.groupingGrid = instance)} changeMenuStatus={this.changeMenuStatus} saveState={this.getHomeGroupingData} stateObj={this.state.homeGridObj} menuOn={this.state.menuOn} />
    }

    /**
    * Description: This method is used for rendering the selectable grid screen and home screen grouping grids
    * @param {null}  
    * @return {JSX}
    */
    toggleHomeSelectable() {
        if (this.state.selectableOn) {
            return (<this.renderSeletable />);
        } else {
            return <this.renderHome />;
        }
    }

    /**
    * Description: This method return JSX for mode screen
    * @param {null}  
    * @return {JSX}
    */
    renderModeMenu(currentModeID) {
        let imageURL = "";
        let descLable = "";
        for (var modeID = 0; modeID < this.props.reducerUiConfig.message.data.modes.length; modeID++) {
            if (this.props.reducerUiConfig.message.data.modes[modeID].id === currentModeID) {
                imageURL = this.props.reducerUiConfig.message.data.modes[modeID].image.url || "";
                descLable = this.props.reducerUiConfig.message.data.modes[modeID].i8nDescription || "description";
                break;
            }
        }
        if (this.state.modeOverLayActive) {
            return (
                <BaseOverlay myClass={'menu-mode-sub-menu'}>
                    <div className="kids-zone">
                        <div className="heading"><img src={imageURL} alt="" /></div>
                        <div className="content">
                            <p><Trans i18nKey={descLable}>Message</Trans></p>
                        </div>
                    </div>
                </BaseOverlay>);
        } else {
            return "";
        }
    }


    /****************** MENU HANDLING***************************/

    /**
     * Description: This method call on menu Item Focus
     * @param {Object}  menuObj 
     * @return {null}
     */
    showSelectable(menuObj) { //on menu item focus
        this.removeSubMenu(); // removing submenus
        if (menuObj.isGrouping) {
            this.setState({
                modeOverLayActive: false,
                selectableOn: true,
                groupingID: menuObj.id,
            });
            this.gridSelectables.deFocus();
        } else if (menuObj.isLanguage) { // on language select
            this.setState({
                isMenuLanguageOn: true
            });
        } else if (menuObj.isFilter) {
            this.setState({
                isMenuFilterOn: true
            });
            this.menuFilterGrid.defocus();
        } else {
            if (!menuObj.isMode) {
                this.setState({ modeOverLayActive: false, selectableOn: false, });
                if (!Utilities.isEmptyObject(this.gridSelectables) && this.gridSelectables.isComponentLoaded()) {
                    this.gridSelectables.deFocus();
                }
            } else {
                this.modeID = menuObj.id;
                this.setState({ modeOverLayActive: true, selectableOn: false });
                if (!Utilities.isEmptyObject(this.gridSelectables) && this.gridSelectables.isComponentLoaded()) {
                    this.gridSelectables.deFocus();
                }
            }
        }
    }
    /**
     * Description: This method call on Submenu Item Focus
     *  @param {Object}  menuObj 
     * @return {null}
     */
    onSelectMenuGrouping(menuObj) { // on menu enter or right
        if (menuObj.isGrouping && !Utilities.isEmptyObject(this.gridSelectables) && this.gridSelectables.isComponentLoaded()) {
            // this.menuComponent.deFocus();
            this.gridSelectables.focus();
            this.changeMenuStatus();
        } else {
            if (menuObj.isMode) {
                this.props.actionRefreshtSelectables();
                this.goToScreen(SCREENS.dataloading + "/?mode=" + menuObj.id, null);
            } else if (menuObj.isLanguage && !Utilities.isEmptyObject(this.menuLangGrid) && this.menuLangGrid.isComponentLoaded()) {
                this.menuComponent.deFocus();
                this.menuLangGrid.focus();
            } else if (menuObj.isFilter && !Utilities.isEmptyObject(this.menuFilterGrid) && this.menuFilterGrid.isComponentLoaded()) {
                this.menuComponent.deFocus();
                this.menuFilterGrid.focus();
            }
        }
    }
    /**
     * Description : change MenuActive status
     * @returns {undefined}
     */
    changeSubMenuActiveStatus(status = "") {
        this.setState((prev) => {
            if (status !== "") {
                return { isSubMenuActive: status }
            }
            return { isSubMenuActive: !prev.isSubMenuActive }
        });
    }

    /**
    * Description : change MenuActive status
    * @returns {undefined}
    */
    removeSubMenu() {
        this.changeSubMenuActiveStatus(false);
        this.setState((prev) => {
            return { isMenuLanguageOn: false, isMenuFilterOn: false, selectableOn: false }
        });
    }

    /**
    * Description : change SubmenuActive status
    * @returns {undefined}
    */
    deactivateSubMenu = () => {
        if (!Utilities.isEmpty(this.menuLangGrid) && this.menuLangGrid.isComponentLoaded()) {
            this.menuLangGrid.deFocus();
        }
        if (!Utilities.isEmpty(this.menuFilterGrid) && this.menuFilterGrid.isComponentLoaded()) {
            this.menuFilterGrid.deFocus();
        }
        this.menuComponent.focus();
    }

    /**************************FILTER FUNCTIONS  ***********************/
    /**
     * Description: This method check if anything change in filter
     * @return {null}
     */
    filterChangeStatus() {
        this.isFilterValueChange = !this.isFilterValueChange;
    }

    /******************** MENU GROUPINGS AND MODES ***************/
    /**
     * Description: This method call on Home and Selectables toggle
     * @return {JSX}
     */

    /**
    * Description : callback method for backkey pressed on selectable grid screen
    */
    onBackKeyPressed = () => {
        this.gridSelectables.deFocus();
        this.setState({ selectableOn: false, selectableActive: false });
    }

    /**
    * Description: This method return JSX for selectable grid screen
    * @param {null}  
    * @return {JSX}
    */
    renderSeletable() {
        var isFocusNeeded = false;
        var selectableStyle = {
            position: 'relative'
        }
        if (window.innerWidth <= 1280) {
            selectableStyle.top = '33px';
            if ((Utilities.isEmptyObject(this.gridSelectables) || !this.gridSelectables.isFocused()) && this.state.menuOn) {
                selectableStyle.left = '322px';
            }
            else {
                isFocusNeeded = true;
                selectableStyle.left = '0px';
            }
        } else {
            selectableStyle.top = '50px';
            if ((Utilities.isEmptyObject(this.gridSelectables) || !this.gridSelectables.isFocused()) && this.state.menuOn) {
                selectableStyle.left = '322px';
            } else {
                isFocusNeeded = true;
                selectableStyle.left = '0px';
            }
        }
        return (<div style={selectableStyle}><Selectables onRef={instance => (this.gridSelectables = instance)} groupingID={this.state.groupingID} selectableItemClicked={this.selectableItemClicked} isFocus={isFocusNeeded} onBackKeyPressed={this.onBackKeyPressed}></Selectables></div>);
    }

    /**
    * Description: this is a callback method for enter click on selectable grid
    * @param {integer} index
    */
    selectableItemClicked(index) {
        this.goToScreen(SCREENS.programdetails + "/" + index, null);
    }

    /**
    * Description: React Inbuilt method
    * @return {JSX}
    */
    render() {
        const showMenuLanguage = this.state.menuOn && this.state.isMenuLanguageOn && !this.state.selectableOn;
        const showMenuFilter = this.state.menuOn && this.state.isMenuFilterOn && !this.state.selectableOn;
        if (this.state.data.type === alertConstants.ERROR) {
            return <div>{this.state.data.data}</div>
        }
        return (
            <div key={this.state.reload}>
                <div className="container" >
                    {this.state.menuOn ? <Menu onRef={instance => (this.menuComponent = instance)} openMenu={this.state.menuOn} changeMenuStatus={this.changeMenuStatus.bind(this)} onFocus={this.showSelectable} onItemSelect={this.onSelectMenuGrouping} changeSubMenuActiveStatus={this.changeSubMenuActiveStatus} subMenuActiveStatus={this.state.isSubMenuActive} /> : ""}

                    {showMenuLanguage ? <MenuLanguage onRef={instance => (this.menuLangGrid = instance)} removeSubMenu={this.deactivateSubMenu} actionSaveUserPreferences={this.props.actionSaveUserPreferences} getUserPreferences={this.props.reducerGetUserPreferences} stayId={this.stayId} changeLanguage={this.changeLanguage} /> : ""}

                    {showMenuFilter ? <MenuFilter onRef={instance => (this.menuFilterGrid = instance)} removeSubMenu={this.deactivateSubMenu} actionSaveUserPreferences={this.props.actionSaveUserPreferences} getUserPreferences={this.props.reducerGetUserPreferences} configUserPreference={this.props.reducerUiConfig.message.data.programFilters} filterChangeStatus={this.filterChangeStatus} stayId={this.stayId} /> : ""}
                    {this.renderModeMenu(this.modeID)}
                    {this.toggleHomeSelectable()}
                </div>
            </div>
        )
    }
};
export default invokeConnect(Home, null, 'getGroupings',
    {   //actions
        actionGetBoookmarks: actionGetBoookmarks,
        actionGetUserPreferences: actionGetUserPreferences,
        actionSaveUserPreferences: actionSaveUserPreferences,
        actionRefreshtSelectables: actionRefreshtSelectables
    },
    {  //reducers
        reducerRetSelectables: 'getSelectables',
        reducerUiConfig: 'getUiConfig',
        reducerGetUserPreferences: 'userPreferences'
    });