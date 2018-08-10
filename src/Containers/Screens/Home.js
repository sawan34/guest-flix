/**
* Summary: Home Screen Component
* Description: This is home screen created by extending base Screen
* @author Sawan Kumar
* @date  22.06.2018
*/

//external Libraries 
import React from 'react';
import _ from 'lodash';
import { Trans } from 'react-i18next';
//screens
import BaseScreen, { invokeConnect } from './BaseScreen';
//constants
import KeyMap from '../../constants/keymap.constant';
import { SCREENS } from '../../constants/screens.constant';
import { alertConstants } from '../../constants/alert.constant';
import { commonConstants } from '../../constants/common.constants';
import roomUser from '../../services/service.roomUser';
//common uitilities
import Utilities from '../../commonUtilities';
//Actions
import { actionGetUserPreferences, actionSaveUserPreferences } from '../../actions/action.userPreferences';
import { actionGetBoookmarks } from '../../actions/action.bookmark';
import { actionGetSelectables, actionRefreshtSelectables } from '../../actions';
//Other Components
import Menu from '../../Component/Menu/Menu';
import HomeHorizontalView from '../../Component/Grids/HorizontalListView';
import Selectables from '../../Component/Menu/Groupings/Selectables';
import MenuLanguage from '../../Component/Menu/Language/Language';
import BaseOverlay from '../../Component/Overlay/BaseOevrlay';
import MenuFilter from  '../../Component/Menu/Filter/Filter';



//declaring currency symbol below so that no iteration of function done each time;
const currency = Utilities.getCurrencySymbol();
class Home extends BaseScreen {
    constructor() {
        super();
        this.state = {
            ...this.state,
            screen: SCREENS.home,//This is mandatory for all the screens 
            reload: true,
            keyEvent: {},
            groupWiseSelectables: [],
            gridPositionRow: 0,
            gridPositionColumn: [],
            numberOfGrouping: 0,
            scrollY: 0,
            homeGroupings: [],
            activeProgramId: 0,
            activeGridInfo: {
                title: "",
                description: "",
                rating: "",
                amount: "",
                runTime: ""
            },
            startIndex: 0,
            endIndex: 0,
            prefixGroup: '',
            selectable: 0,
            groupWiseSelectablePage: {},
            menuOn: false,
            timeInterval: 0,
            selectableOn: false,
            selectableActive: false,
            groupingID: 0,
            isMenuLanguageOn: false, //true when menu got focus
            isSubMenuActive: false, //true when menu got selected
            kidOverLayActive: false,
            adultOverlayActive: false,
            isMenuFilterOn:false, //true when menu filter got focus
            modeOverLayActive: false,
        }
        this.scrollSpeed = 200;
        this.topPosition = 0;
        this.numberTofetchSeletables = 10; //number of seletables to fetch at time
        this.gridrowLoad = 4;
        this.groupingHeight = Utilities.getHorizontalHeight();
        this.stayId = "";
        this.isFilterValueChange = false;

        this.loadNextData = this.loadNextData.bind(this);
        this.handleFocusChange = this.handleFocusChange.bind(this);
        this.getSelectablesOnLoad = this.getSelectablesOnLoad.bind(this);
        this.renderHome = this.renderHome.bind(this);
        this.renderSeletable = this.renderSeletable.bind(this);
        this.toggleHomeSelectable = this.toggleHomeSelectable.bind(this);
        this.onSelectMenuGrouping = this.onSelectMenuGrouping.bind(this);
        this.showSelectable = this.showSelectable.bind(this);
        this.selectableItemClicked = this.selectableItemClicked.bind(this);
        this.findGroupingById = this.findGroupingById.bind(this);
        this.changeSubMenuActiveStatus = this.changeSubMenuActiveStatus.bind(this);
        this.removeSubMenu = this.removeSubMenu.bind(this);
        this.filterChangeStatus = this.filterChangeStatus.bind(this);

    }
    /**
     * Description:Setting  Menu status On || Off 
     */
    changeMenuStatus() {
        if (!Utilities.isEmptyObject(this.menuComponent)) {
            if (this.menuComponent.isFocused()) {
                this.menuComponent.deFocus();
            }
        }        
        this.setState(prevState => {
            return { menuOn: !prevState.menuOn }
        },()=>{ //reload if change in filter
            if(!this.state.menuOn && this.isFilterValueChange && !this.state.selectableOn){
                this.isFilterValueChange = false;
                let mode;
                try{
                    mode = this.props.reducerUiConfig.message.data.currentMode;
                }catch(e){
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
     *  Description:fetching grouping
     */
    componentDidMount() {
        //call for bookmarks
        this.stayId = roomUser.getStayId();
        this.props.actionGetBoookmarks(this.stayId);
        //call User Preferences
        this.props.actionGetUserPreferences(this.stayId);
        if (this.state.groupWiseSelectables.length > 0) {
            return true;
        }
        let groupWiseSelectablePage = {};
        if (this.props.networkData.type === alertConstants.SUCCESS && alertConstants.SUCCESS === this.props.reducerUiConfig.type) {
            //parsing on home Grouping from All grouping
            const allGroupings =this.props.reducerUiConfig.message.data.homeGroupings;
            const homeGroupingIds = allGroupings.filter((item, pos)=>allGroupings.indexOf(item) == pos); //unique grouping
            let homeGroupingDetails = [], counter = 0;
            homeGroupingIds.forEach((item, i) => {
                if (this.findGroupingById(item).length > 0) {
                    homeGroupingDetails[counter] = this.findGroupingById(item)[0];
                    // adding seletables page wise 
                    const seletablesPageWise = _.chunk(homeGroupingDetails[counter].selectables, this.numberTofetchSeletables);
                    const totalPages = seletablesPageWise.length
                    groupWiseSelectablePage[item] = {
                        seletablesPageWise: seletablesPageWise,
                        totalPages: totalPages,
                        currentPage: 0
                    };
                    counter++;
                }
            });
            this.state.homeGroupings = homeGroupingDetails;

        }

        if (this.state.homeGroupings.length > 0) {
            this.getSelectablesOnLoad(groupWiseSelectablePage);
        }

    }

    /**
     * Description: get Selectables
     * @return {promise}
     */
    findGroupingById(groupId) {
        return this.props.networkData.message.data.filter((item) => {
            if (item.selectables.length < 1) {
                return false;
            }
            return (groupId === item.id);
            return false;
        });
    }

    /**
     * Description: get Selectables
     * @return {promise}
     */
    getSelectablesOnLoad(groupWiseSelectablePage) {
        let selfThis = this; // this variable for promise which is new object
        Promise.all(this.state.homeGroupings.map(function (item) {
            return new Promise(function (resolve, reject) {
                resolve(selfThis.props.actionGetSelectables.call(null, groupWiseSelectablePage[item.id].seletablesPageWise[groupWiseSelectablePage[item.id].currentPage], item.id));
            }); //getting data for all request
        })).then(function (values) {
            selfThis.setState((prevState) => {
                let newSelectables = selfThis.state.homeGroupings.map((item) => {
                    const groupId = item.id;
                    return selfThis.props.reducerRetSelectables.filter((dataItem) => {
                        return dataItem.groupId === groupId;
                    });
                });
                newSelectables = _.flatten(newSelectables);
                return {
                    groupWiseSelectables: newSelectables,
                    numberOfGrouping: selfThis.props.reducerRetSelectables.length,
                    activeGridInfo: {
                        title: newSelectables[0].data[0].title,
                        description: newSelectables[0].data[0].shortDescription,
                        rating: newSelectables[0].data[0].rating,
                        amount: newSelectables[0].data[0].price,
                        runTime: newSelectables[0].data[0].runTime,
                    },
                    activeProgramId: newSelectables[0].data[0].programId,
                    endIndex: selfThis.gridrowLoad,
                    groupWiseSelectablePage: { ...groupWiseSelectablePage }
                }
            })
        });
    }

    /**
      * Description: Handle Load data for groupings
     * @param {number}  groupId 
     * @param {function} callBack
     * @return {Boolen || Object}
     */
    loadNextData(groupId, callBack) {
        try {
            const currentActiveData = this.state.groupWiseSelectablePage[groupId];
            const selfThis = this;
            let selectablesToCall = [];

            if (currentActiveData.currentPage + 1 < currentActiveData.totalPages) {
                currentActiveData.currentPage = currentActiveData.currentPage + 1;
                selectablesToCall = currentActiveData.seletablesPageWise[currentActiveData.currentPage];
                let promise = new Promise((resolve, reject) => {
                    resolve(selfThis.props.actionGetSelectables.call(null, selectablesToCall, groupId, true));
                });
                promise.then((successMessage) => {
                    if (this.props.reducerRetSelectables.type === alertConstants.SUCCESS && _.isNumber(this.props.reducerRetSelectables.groupId)) {
                        this.setState((prevState) => {
                            const newGropWiseSelectable = prevState.groupWiseSelectables.map((item) => {
                                if (item.groupId === this.props.reducerRetSelectables.groupId) {
                                    callBack(this.prepareDataForGrid(this.props.reducerRetSelectables.data, groupId));
                                    item.data = [...item.data, ...this.props.reducerRetSelectables.data];
                                    return item;
                                }
                                return item;
                            })
                            return {
                                groupWiseSelectables: newGropWiseSelectable
                            };
                        });
                    }

                });

            } else {
                return false;
            }
        } catch (err) {
            return false;
        }
    }

    /**
    * Description: This Could handle Key Event Handle Key 
    * @param {object}  Event 
    * @return {null}
    */
    handleKey(event) {
        var keyCode = event.keyCode;
        if (!Utilities.isEmptyObject(this.menuFilterGrid) && this.menuFilterGrid.isFocused()) { //for menu language
            return;
        }
        if (!Utilities.isEmptyObject(this.menuLangGrid) && this.menuLangGrid.isFocused()) { //for menu language
            return;
        }
        if (!Utilities.isEmptyObject(this.gridSelectables) && this.gridSelectables.isFocused()) {
            if (keyCode === KeyMap.VK_BACK) {
                this.gridSelectables.deFocus();
                this.setState({
                    selectableOn: false,
                });

                return;
            }
            return;
        }

        if (!Utilities.isEmptyObject(this.menuComponent) && this.menuComponent.isFocused()) {
            return;
        }
        switch (keyCode) {
            case KeyMap.VK_UP:
                this.handleUpDown(commonConstants.DIRECTION_UP, event);
                break;
            case KeyMap.VK_DOWN:
                this.handleUpDown(commonConstants.DIRECTION_DOWN, event);
                break;
            case KeyMap.VK_ENTER:
                // setting keyEvent null because coming back this screen state should not have any key
                this.setState({
                    keyEvent: null
                });
                this.goToScreen(SCREENS.programdetails + "/" + this.state.activeProgramId, null);
                break;
            case KeyMap.VK_RIGHT:
                this.setState({
                    keyEvent: event
                });
                break
            case KeyMap.VK_LEFT:
                if (this.state.gridPositionColumn[this.state.gridPositionRow] === 0 ||
                    this.state.gridPositionColumn[this.state.gridPositionRow] === undefined) {
                    this.changeMenuStatus();
                } else {
                    this.setState({
                        keyEvent: event
                    });
                }
                break

            default:
                this.setState({
                    keyEvent: event
                });
                break;
        }
    }

    /**
    * Description: This Could handle Up and Down
    * @param {string}  direction 
    * @param {object}  Event 
    * @return {null}
    */
    handleUpDown = (direction, event) => {
        if (event.timeStamp - this.state.timeInterval > this.scrollSpeed) { // condition for handling long press
            if (direction === commonConstants.DIRECTION_UP) {
                if (this.state.gridPositionRow > 0) {
                    this.setState((prevState) => {
                        return { gridPositionRow: prevState.gridPositionRow - 1, scrollY: prevState.scrollY + this.groupingHeight, keyEvent: event, startIndex: prevState.startIndex - 1, endIndex: prevState.endIndex - 1, timeInterval: event.timeStamp };
                    });
                }
            }

            if (direction === commonConstants.DIRECTION_DOWN) {
                if (this.state.gridPositionRow < this.state.numberOfGrouping - 1) {
                    this.setState((prevState) => {
                        return { gridPositionRow: prevState.gridPositionRow + 1, scrollY: prevState.scrollY - this.groupingHeight, keyEvent: event, startIndex: prevState.startIndex + 1, endIndex: prevState.endIndex + 1, prefixGroup: prevState.startIndex, timeInterval: event.timeStamp };
                    });
                }
            }
        }
    }

    /**
     * Description: This method callback is going to be used for Focus positions
     * @param {number}  focusLostPosition 
     * @param {number}  currentItemFocus 
     * @return {null}
     */
    handleFocusChange(focusLostPosition, currentItemFocus) {
        this.setState((prevState) => {
            const position = prevState.gridPositionColumn[prevState.gridPositionRow] = currentItemFocus;
            return {
                activeProgramId: prevState.groupWiseSelectables[prevState.gridPositionRow].data[currentItemFocus].programId,
                gridPositionColumn: prevState.gridPositionColumn,
                keyEvent: null,
                activeGridInfo: {
                    title: prevState.groupWiseSelectables[prevState.gridPositionRow].data[currentItemFocus].title,
                    description: prevState.groupWiseSelectables[prevState.gridPositionRow].data[currentItemFocus].shortDescription,
                    rating: prevState.groupWiseSelectables[prevState.gridPositionRow].data[currentItemFocus].rating,
                    amount: prevState.groupWiseSelectables[prevState.gridPositionRow].data[currentItemFocus].price,
                    runTime: prevState.groupWiseSelectables[prevState.gridPositionRow].data[currentItemFocus].runTime,
                }
            }
        });
    }

    /**
     * Description : Get Group Name By Group Id
     * @param {number}  groupId
     * @returns {string}
     */
    getGroupNameById(groupId) {
        const arr = [...this.state.homeGroupings];
        let groupName = "";

        arr.forEach((item) => {
            if (item.id === groupId) {
                groupName = item.label;
            }
        });
        return groupName;
    }

    /**
    * Description : Get Group Name By Group Id
    * @param {number}  groupId
    * @returns {string}
    */
    getGroupImageType(groupId) {
        const arr = [...this.state.homeGroupings];
        let imageType = "";

        arr.forEach((item) => {
            if (item.id === groupId) {
                imageType = item.imageType;
            }
        });
        return imageType;
    }

    /**
     * Description : Get Group Wrap By Group Id
     * @param {number}  groupId
     * @returns {string}
     */
    getGroupScrollWrap(groupId) {
        const arr = [...this.state.homeGroupings];
        let scrollWrap = false;

        arr.forEach((item) => {
            if (item.id === groupId) {
                scrollWrap = item.scrollWrap;
            }
        });
        return scrollWrap;
    }

    /**
     * Description: Prepare Data for Grid
     */
    /**
     * Description :  Prepare Data for Grid.
     * @param {array} selectables
     * @param {number} id
     *  @returns {Object}
     */
    prepareDataForGrid(selectables, id) {
        let data = "";
        let imageType = this.getGroupImageType(id);
        data = selectables.map((item, index) => {
            let imageUrl = "", dimension = {};
            item.images.forEach(element => {
                if (element.type === imageType) {
                    imageUrl = element.url;
                    dimension = {
                        height: element.height,
                        width: element.width
                    }
                }
            });
            return {
                image: imageUrl,
                title: item.title,
                dimension: dimension,
                description: item.shortDescription,
                rating: item.rating,
                amount: currency + item.price,
                runTime: item.runTime
            }
        });
        return data;
    }    
   
    
    /**
      * Description : render Home
      *  @returns {JSX}
      */
    renderHome() {
        var style = {
            transform: "translate3d(0px," + this.state.scrollY + "px,0)",
            transition: 'all 300ms ease-in-out'
        }
        const classForBlur = this.state.menuOn ? "slide-container-wrapper bluureffects" : "slide-container-wrapper";
        return (<div><div className={classForBlur} data-show="home">
            <div className="home-top-poster">
                <img src="images/poster_top.png" />
            </div>
            <div className="slider-main-container">
                <div className="sliders-list" style={style}>
                    {
                        this.state.groupWiseSelectables.map((item, index) => {
                            //doing windowing
                            if ((index >= this.state.startIndex && index <= this.state.endIndex) || index === this.state.prefixGroup) {
                                return this.renderGroupingSeletables.call(this, item.data, item.groupId, index);
                            }

                        })
                    }
                </div>
            </div>
        </div>
            <div className="home-right-poster"></div>
            <div className="home-bottom-poster"></div></div>);
    }

    
  toggleHomeSelectable() {
        if (this.state.selectableOn) {
            return (<this.renderSeletable />);
        } else {
            return <this.renderHome />;
        }
    }

/**
* Description: This method is used for populating grids
*  @param {object}  selectables 
* @param {number}   id
* @param {number}   index 
* @return {JSX}
*/
renderGroupingSeletables(selectables, id, index) {
        const imageType = this.state.homeGroupings[index].imageType; // imagetype 
        let selectablesData = this.prepareDataForGrid(selectables, id);

        const activeGrid = this.state.gridPositionColumn[index] ? this.state.gridPositionColumn[index] : 0;
        const maxVisibleItem = selectablesData.length > 1 ? selectablesData.length : 1;
        if (selectablesData.length < 1) {
            return "";
        }
        let wrapperActive = index === this.state.gridPositionRow ? "slider-wrapper active" : "slider-wrapper";
        let top = { top: 0 };
        if (index > 0) {
            this.position = this.groupingHeight * index;
            top = { top: this.position + 'px' };
        }
        return (<div key={index} className="slider-row" style={top} > <h2>{this.getGroupNameById(id)}</h2>
            <div className={wrapperActive}><HomeHorizontalView dataSource={selectablesData} key={"hori" + index} defaultSelectedPosition={activeGrid} onItemSelected={this.itemSelected} maxVisibleItem={this.numberTofetchSeletables} keyEvent={this.state.keyEvent} onFocusChange={this.handleFocusChange} activeEvent={index === this.state.gridPositionRow} loadNextData={this.loadNextData} id={id} isScrollWrap={this.getGroupScrollWrap(id)} />
            </div></div>);
}

/****************** MENU HANDLING***************************/

/**
 * Description: This method call on menu Item Focus
 * @param {Object}  menuObj 
 * @return {null}
 */
showSelectable(menuObj) { //on menu item focus
    this.removeSubMenu(); // removing submenus
    if (menuObj.type === commonConstants.MENU_GROUPING_TYPE) {
        this.setState({
            modeOverLayActive: false,
            selectableOn: true,
            groupingID: menuObj.id,

        });
        this.gridSelectables.deFocus();
    } else if (menuObj.name === commonConstants.MENU_LANGUAGE) { // on language select
        this.setState({
            isMenuLanguageOn: true
        });
    }else if(menuObj.name === commonConstants.MENU_FILTER){
        this.setState({
            isMenuFilterOn: true
        });
        this.menuFilterGrid.defocus();
    }else {
        if (Utilities.isEmpty(menuObj.isMode)) {
            this.setState({ modeOverLayActive: false, selectableOn: false, });
            this.gridSelectables.deFocus();
        } else {
            this.modeID = menuObj.id;
            this.setState({ modeOverLayActive: true, selectableOn: false });
            this.gridSelectables.deFocus();

        }
    }
}
/**
 * Description: This method call on Submenu Item Focus
 *  @param {Object}  menuObj 
 * @return {null}
 */
onSelectMenuGrouping(menuObj) { // on menu enter or right
    if (menuObj.type === commonConstants.MENU_GROUPING_TYPE) {
        this.gridSelectables.focus();
        this.changeMenuStatus();
    } else {
        if (menuObj.isMode) {
            this.props.actionRefreshtSelectables();
            this.goToScreen(SCREENS.dataloading + "/?mode=" + menuObj.id, null);
        } else if (menuObj.name === commonConstants.MENU_LANGUAGE) {
            this.menuComponent.deFocus();
            this.menuLangGrid.focus();                
        }else if (menuObj.name === commonConstants.MENU_FILTER){
            this.menuComponent.deFocus();                
            this.menuFilterGrid.focus();
        }else {
            this.menuComponent.deFocus(); 
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
        return { isMenuLanguageOn: false,isMenuFilterOn:false,selectableOn:false }
    });
}



/******************** MENU GROUPINGS AND MODES ***************/
selectableItemClicked(index) {
    this.goToScreen(SCREENS.programdetails + "/" + index, null);
}

/**
 * Description: This method call on Home and Selectables toggle
 * @return {JSX}
 */
renderSeletable() {
    var selectableStyle = {
        position: 'relative'
    }
    if (window.innerWidth <= 1280) {
        selectableStyle.top = '33px';
        if (Utilities.isEmptyObject(this.gridSelectables) || !this.gridSelectables.isFocused()) {
            selectableStyle.left = '322px';
        }
        else {
            selectableStyle.left = '0px';
        }
    } else {
        selectableStyle.top = '50px';
        if (Utilities.isEmptyObject(this.gridSelectables) || !this.gridSelectables.isFocused()) {
            selectableStyle.left = '322px';
        } else {
            selectableStyle.left = '0px';
        }
    }
    return (<div style={selectableStyle}><Selectables onRef={instance => (this.gridSelectables = instance)} groupingID={this.state.groupingID} selectableItemClicked={this.selectableItemClicked} ></Selectables></div>);
}

deactivateSubMenu = () => {
    this.menuLangGrid.deFocus();
    this.menuComponent.focus();
}

/**************************FILTER FUNCTIONS  ***********************/
/**
 * Description: This method check if anything change in filter
 * @return {null}
 */
filterChangeStatus(){
    this.isFilterValueChange = !this.isFilterValueChange;
}
/******************** MENU GROUPINGS AND MODES ***************/
/**
 * Description: This method call on Home and Selectables toggle
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
    return (<div style={selectableStyle}><Selectables onRef={instance => (this.gridSelectables = instance)} groupingID={this.state.groupingID} selectableItemClicked={this.selectableItemClicked} isFocus={isFocusNeeded}></Selectables></div>);

}


renderModeMenu(currentModeID) {
    let imageURL = "";
    let descLable = "";
    for (var modeID = 0; modeID < this.props.reducerUiConfig.message.data.modes.length; modeID++) {
        if (this.props.reducerUiConfig.message.data.modes[modeID].id === currentModeID) {
            imageURL = this.props.reducerUiConfig.message.data.modes[modeID].image.url || "";
            descLable = this.props.reducerUiConfig.message.data.modes[modeID].i8nDescription || "abcdefg";
            break;
        }
    }

    if (this.state.modeOverLayActive) {
        return (
            <BaseOverlay myClass={'menu-mode-sub-menu'}>
                <div className="kids-zone">
                    <div className="heading"><img src={imageURL} /></div>
                    <div className="content">
                        <p><Trans i18nKey={descLable}>Message</Trans></p>
                    </div>
                </div>
            </BaseOverlay>);
    }
}


/**
* Description: React Inbuilt method
* @return {JSX}
*/
render() {
        if (this.state.data.type === alertConstants.ERROR) {
            return <div>{this.state.data.data}</div>
        }
        return (
            <div key={this.state.reload}>
                <div className="container" >
                    {this.state.menuOn && <Menu onRef={instance => (this.menuComponent = instance)} openMenu={this.state.menuOn} changeMenuStatus={this.changeMenuStatus.bind(this)} onFocus={this.showSelectable} onItemSelect={this.onSelectMenuGrouping} changeSubMenuActiveStatus={this.changeSubMenuActiveStatus} subMenuActiveStatus={this.state.isSubMenuActive} />}

                    {this.state.menuOn && this.state.isMenuLanguageOn && !this.state.selectableOn && <MenuLanguage onRef={instance => (this.menuLangGrid = instance)} removeSubMenu={this.deactivateSubMenu} actionSaveUserPreferences={this.props.actionSaveUserPreferences} getUserPreferences={this.props.reducerGetUserPreferences} stayId={this.stayId} changeLanguage={this.changeLanguage} />}

                    {this.state.menuOn && this.state.isMenuFilterOn && !this.state.selectableOn && <MenuFilter onRef={instance => (this.menuFilterGrid = instance)} removeSubMenu={this.deactivateSubMenu} actionSaveUserPreferences={this.props.actionSaveUserPreferences} getUserPreferences={this.props.reducerGetUserPreferences} configUserPreference={this.props.reducerUiConfig.message.data.programFilters} filterChangeStatus={this.filterChangeStatus} stayId={this.stayId} />}
                    {this.renderModeMenu(this.modeID)}
                    {this.toggleHomeSelectable()}
                </div>
            </div>
        )
    }
};
export default invokeConnect(Home, null, 'getGroupings',
    {   //actions
        actionGetSelectables: actionGetSelectables,
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