/**
* Summary: Home Screen Component
* Description: This is home screen created by extending base Screen
* @author Sawan Kumar
* @date  22.06.2018
*/
import React from 'react';
import BaseScreen, { invokeConnect } from './BaseScreen';
import KeyMap from '../../constants/keymap.constant'
import { translate, Trans } from 'react-i18next';
import { SCREENS } from '../../constants/screens.constant';
import { actionGetSelectables } from '../../actions';
import { alertConstants } from '../../constants/alert.constant';
import Menu from '../../Component/Menu/Menu';
import _ from 'lodash';

import HomeHorizontalView from '../../Component/Grids/HorizontalListView'
const keyDirections =  {up: "up",down:"down"};

class Home extends BaseScreen {

    constructor() {
        super();
        this.state = {
            ...this.state,
            screen: SCREENS.home,//This is mandatory for all the screens 
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
            menuOn:false
        }
        this.topPosition = 0;
        this.numberTofetchSeletables = 10; //number of seletables to fetch at time
        this.gridrowLoad = 4;
        this.loadNextData = this.loadNextData.bind(this);
        this.handleFocusChange = this.handleFocusChange.bind(this);
        this.getSelectablesOnLoad = this.getSelectablesOnLoad.bind(this);
    }
    /**
     * Description:Setting  Menu status On || Off 
     */
    changeMenuStatus() {
        this.setState(prevState=>{
            return {menuOn:!prevState.menuOn}
        });
    }

    /**
     *  Description:fetching grouping
     */
    componentDidMount() {
        if (this.state.groupWiseSelectables.length > 0) {
            return true;
        }
        let groupWiseSelectablePage = {};
        if (this.props.networkData.type === alertConstants.SUCCESS && alertConstants.SUCCESS === this.props.uiConfig.type) {
            //parsing on home Grouping from All grouping
            const homeGroupingIds = this.props.uiConfig.message.data.homeGroupings;
            this.state.homeGroupings = this.props.networkData.message.data.filter((item) => {
                if (item.selectables.length < 1) {
                    return false;
                }
                if (homeGroupingIds.indexOf(item.id) >= 0) {
                    // adding seletables page wise 
                    const seletablesPageWise = _.chunk(item.selectables, this.numberTofetchSeletables);
                    const totalPages = seletablesPageWise.length
                    groupWiseSelectablePage[item.id] = {
                        seletablesPageWise: seletablesPageWise,
                        totalPages: totalPages,
                        currentPage: 0
                    };
                    return true;
                }
            });
        }

        if (this.state.homeGroupings.length > 0) {
            this.getSelectablesOnLoad(groupWiseSelectablePage);
        }

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
                const newSelectables = selfThis.props.getSelectables;
                return {
                    groupWiseSelectables: newSelectables,
                    numberOfGrouping: selfThis.props.getSelectables.length,
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
                    if (this.props.getSelectables.type === alertConstants.SUCCESS && _.isNumber(this.props.getSelectables.groupId)) {
                        this.setState((prevState) => {
                            const newGropWiseSelectable = prevState.groupWiseSelectables.map((item) => {
                                if (item.groupId === this.props.getSelectables.groupId) {
                                    callBack(this.prepareDataForGrid(this.props.getSelectables.data, groupId));
                                    item.data = [...item.data, ...this.props.getSelectables.data];
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

        if (this.state.menuOn) {
            return;
        }
        if (localStorage.isMenuActive === "true") {
            return;
        }
        switch (keyCode) {
            case KeyMap.VK_UP:
                this.handleUpDown(keyDirections.up, event);
                break;
            case KeyMap.VK_DOWN:
                this.handleUpDown(keyDirections.down, event);
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

                    if (this.state.gridPositionColumn[this.state.gridPositionRow]===0 ||
                        this.state.gridPositionColumn[this.state.gridPositionRow] === undefined ) {
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
        if (direction === keyDirections.up) {
            if (this.state.gridPositionRow > 0) {
                //  this.fetchNextSelectableForActive();
                this.setState((prevState) => {
                    return { gridPositionRow: prevState.gridPositionRow - 1, scrollY: prevState.scrollY + 690, keyEvent: event, startIndex: prevState.startIndex - 1, endIndex: prevState.endIndex - 1 };
                });
            }
        }

        if (direction === keyDirections.down) {
            if (this.state.gridPositionRow < this.state.numberOfGrouping - 1) {
                this.setState((prevState) => {
                    return { gridPositionRow: prevState.gridPositionRow + 1, scrollY: prevState.scrollY - 690, keyEvent: event, startIndex: prevState.startIndex + 1, endIndex: prevState.endIndex + 1, prefixGroup: prevState.startIndex };
                });
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
        console.log(currentItemFocus);
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
     * Description: Prepare Data for Grid
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
                dimension: dimension
            }
        });
        return data;
    }
    /**
    * Description: This method is used for populating grids
    *  @param {object}  selectables 
    * @param {number}  i 
    * @return {JSX}
    */
    renderGroupingSeletables(selectables, id, i) {
        const imageType = this.state.homeGroupings[i].imageType; // imagetype 
        let selectablesData = this.prepareDataForGrid(selectables, id);


        const activeGrid = this.state.gridPositionColumn[i] ? this.state.gridPositionColumn[i] : 0;
        const maxVisibleItem = selectablesData.length > 1 ? selectablesData.length : 1;
        if (selectablesData.length < 1) {
            return "";
        }
        let wrapperActive = i === this.state.gridPositionRow ? "slider-wrapper active" : "slider-wrapper";
        let top = { top: 0 };
        if (i > 0) {
            this.position = 690 * i;
            top = { top: this.position + 'px' };
        }
        return (<div key={i} className="slider-row" style={top} > <h2>{this.getGroupNameById(id)}</h2><div className={wrapperActive}><HomeHorizontalView dataSource={selectablesData} key={"hori" + i} defaultSelectedPosition={activeGrid} onItemSelected={this.itemSelected} maxVisibleItem={this.numberTofetchSeletables} keyEvent={this.state.keyEvent} onFocusChange={this.handleFocusChange} activeEvent={i === this.state.gridPositionRow} loadNextData={this.loadNextData} id={id} />
            {i === this.state.gridPositionRow &&
                <span>
                    {
                       (  (this.state.gridPositionColumn[this.state.gridPositionRow]===0 ||
                            this.state.gridPositionColumn[this.state.gridPositionRow] === undefined ) ) && <div className="arrow left-arrow"></div>
                    }
                    
                    <div className="active-details">
                        <div className="left-col">
                            <div className="heading-row">
                                <h3>{this.state.activeGridInfo.title}</h3> <span className="btn-style">{this.state.activeGridInfo.rating}</span> <span className="time">{this.state.activeGridInfo.runTime}</span> <span className="price">${this.state.activeGridInfo.amount}</span>
                            </div>
                            <p>{this.state.activeGridInfo.description}</p>
                        </div>
                        <div className="key-action-details">Press OK <br />to view and <br />order</div>
                    </div>
                </span>
            }
        </div></div>
        );
    }

    /**
    * Description: React Inbuilt method
    * @return {JSX}
    */
    render() {

        if (this.state.data.type === alertConstants.ERROR) {
            return <div>{this.state.data.data}</div>
        }

        var style = {
            transform: "translate3d(0px," + this.state.scrollY + "px,0)",
            transition: 'all 300ms ease-in-out'
        }
        return (
            <div>
                <div className="container" >
                    {this.state.menuOn && <Menu openMenu = {this.state.menuOn}  changeMenuStatus={this.changeMenuStatus.bind(this)} /> }
                    <div className="slide-container-wrapper" data-show="home">
                        <div className="home-top-poster">
                            <img src="images/poster_top.png" />
                        </div>
                        <div className="slider-main-container">
                            <div className="sliders-list" style={style}>
                                {
                                    this.state.groupWiseSelectables.map((item, i) => {
                                        //doing windowing
                                        if ((i >= this.state.startIndex && i <= this.state.endIndex) || i === this.state.prefixGroup) {
                                            return this.renderGroupingSeletables.call(this, item.data, item.groupId, i);
                                        }

                                    })
                                }
                            </div>
                        </div>
                    </div>
                    <div className="home-right-poster"></div>
                    <div className="home-bottom-poster"></div>
                </div>
            </div>
        )
    }

};
export default invokeConnect(Home, null, 'getGroupings',
    { actionGetSelectables: actionGetSelectables }, {
        getSelectables: 'getSelectables',
        uiConfig: 'getUiConfig'
    });