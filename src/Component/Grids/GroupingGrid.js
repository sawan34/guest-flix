import React from 'react';
import _ from 'lodash';
import { Trans } from 'react-i18next';
import { invokeConnect } from "../../Containers/Screens/BaseScreen";
import HomeHorizontalView from '../../Component/Grids/HorizontalListView';
import { alertConstants } from '../../constants/alert.constant';
import { commonConstants } from '../../constants/common.constants';
import { actionGetSelectables} from '../../actions';
import TvComponent from '../TvComponent'
import KeyMap from '../../constants/keymap.constant';

//common uitilities
import Utilities from '../../commonUtilities';


//declaring currency symbol below so that no iteration of function done each time;
const CURRENCY = Utilities.getCurrencySymbol();

class GroupingGrid extends TvComponent {

    constructor(props) {
        super(props);
        this.state = {
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
            timeInterval: 0,
        }
        this.scrollSpeed = 200;
        this.topPosition = 0;
        this.numberTofetchSeletables = 20; //number of seletables to fetch at time
        this.gridrowLoad = 4;
        this.groupingHeight = Utilities.getHorizontalHeight();
        this.isFilterValueChange = false;
        this.prevGridHeight = 0;
        this.scrollHeightDown = 0;
        this.scrollHeightUp = 0;

        this.loadNextData = this.loadNextData.bind(this);
        this.handleFocusChange = this.handleFocusChange.bind(this);
        this.getSelectablesOnLoad = this.getSelectablesOnLoad.bind(this);
        this.findGroupingById = this.findGroupingById.bind(this);

    }

    /**
     *  Description:fetching grouping
     */
    componentDidMount() {
        super.componentDidMount();
        if (!Utilities.isEmptyObject(this.props.stateObj)) {
            this.stateObjAssignment(this.props.stateObj);
        }

        if (this.state.groupWiseSelectables.length > 0) {
            return true;
        }
        let groupWiseSelectablePage = {};
        if (this.props.networkData.type === alertConstants.SUCCESS && alertConstants.SUCCESS === this.props.reducerUiConfig.type) {
            //parsing on home Grouping from All grouping
            const ALL_GROUPINGS =this.props.reducerUiConfig.message.data.homeGroupings;
            const HOME_GROUPING_IDS = ALL_GROUPINGS.filter((item, pos)=>ALL_GROUPINGS.indexOf(item) === pos); //unique grouping
            let homeGroupingDetails = [], counter = 0;
            HOME_GROUPING_IDS.forEach((item, i) => {
                if (this.findGroupingById(item).length > 0) {
                    homeGroupingDetails[counter] = this.findGroupingById(item)[0];
                    // adding seletables page wise 
                    const PAGEWISE_SELECTABLE = _.chunk(homeGroupingDetails[counter].selectables, this.numberTofetchSeletables);
                    const TOTAL_PAGES = PAGEWISE_SELECTABLE.length
                    groupWiseSelectablePage[item] = {
                        seletablesPageWise: PAGEWISE_SELECTABLE,
                        TOTAL_PAGES: TOTAL_PAGES,
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

        this.focus();
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        this.props.saveState(this.state);
    }


    stateObjAssignment = (stateObj) => {
        this.state.reload = stateObj.reload;
        this.state.keyEvent = stateObj.keyEvent;
        this.state.groupWiseSelectables = stateObj.groupWiseSelectables;
        this.state.gridPositionRow = stateObj.gridPositionRow;
        this.state.gridPositionColumn = stateObj.gridPositionColumn;
        this.state.numberOfGrouping = stateObj.numberOfGrouping;
        this.state.scrollY = stateObj.scrollY;
        this.state.homeGroupings = stateObj.homeGroupings;
        this.state.activeProgramId = stateObj.activeProgramId;
        this.state.activeGridInfo.title = stateObj.activeGridInfo.title;
        this.state.activeGridInfo.description = stateObj.activeGridInfo.description;
        this.state.activeGridInfo.rating = stateObj.activeGridInfo.rating;
        this.state.activeGridInfo.amount = stateObj.activeGridInfo.amount;
        this.state.activeGridInfo.runTime = stateObj.activeGridInfo.runTime;
        this.state.startIndex = stateObj.startIndex;
        this.state.endIndex = stateObj.endIndex;
        this.state.prefixGroup = stateObj.prefixGroup;
        this.state.selectable = stateObj.selectable;
        this.state.groupWiseSelectablePage = stateObj.groupWiseSelectablePage;
        this.setState({ timeInterval: stateObj.timeInterval });
        if (this.props.menuOn) {
            this.deFocus();
        } else {
            this.focus();
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
                let height =0;
                let newSelectables = selfThis.state.homeGroupings.map((item) => {
                    const GROUP_ID = item.id;
                    const IMAGE_TYPE = item.imageType;
                    return selfThis.props.reducerRetSelectables.filter((dataItem) => {
                        if (dataItem.groupId === GROUP_ID) {
                            let imageHeight = dataItem.data[0].images.filter((imageData) => {
                                if (imageData.type === IMAGE_TYPE) {
                                    return true;
                                }else{
                                    return false;
                                }
                            });
                            height = height + selfThis.groupingHeight + parseInt(imageHeight[0].height,10);                            
                            dataItem.scrollHeight = height;
                            return true;
                        } else {
                            return false;
                        }
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
            const CURRENT_ACTIVE_DATA = this.state.groupWiseSelectablePage[groupId];
            let selfThis = this;
            let selectablesToCall = [];

            if (CURRENT_ACTIVE_DATA.currentPage + 1 < CURRENT_ACTIVE_DATA.TOTAL_PAGES) {
                CURRENT_ACTIVE_DATA.currentPage = CURRENT_ACTIVE_DATA.currentPage + 1;
                selectablesToCall = CURRENT_ACTIVE_DATA.seletablesPageWise[CURRENT_ACTIVE_DATA.currentPage];
                let promise = new Promise((resolve, reject) => {
                    resolve(selfThis.props.actionGetSelectables.call(null, selectablesToCall, groupId, true));
                });
                promise.then((successMessage) => {
                    if (this.props.reducerRetSelectables.type === alertConstants.SUCCESS && _.isNumber(this.props.reducerRetSelectables.groupId)) {
                        this.setState((prevState) => {
                            const NEW_GROUPWISE_SELECTABLE = prevState.groupWiseSelectables.map((item) => {
                                if (item.groupId === this.props.reducerRetSelectables.groupId) {
                                    callBack(this.prepareDataForGrid(this.props.reducerRetSelectables.data, groupId));
                                    item.data = [...item.data, ...this.props.reducerRetSelectables.data];
                                    return item;
                                }
                                return item;
                            })
                            return {
                                groupWiseSelectables: NEW_GROUPWISE_SELECTABLE
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
                        return { gridPositionRow: prevState.gridPositionRow - 1, scrollY:-this.scrollHeightUp , keyEvent: event, startIndex: prevState.startIndex - 1, endIndex: prevState.endIndex - 1, timeInterval: event.timeStamp };
                    });
                }
            }

            if (direction === commonConstants.DIRECTION_DOWN) {
                if (this.state.gridPositionRow < this.state.numberOfGrouping - 1) {
                    this.setState((prevState) => {
                        return { gridPositionRow: prevState.gridPositionRow + 1, scrollY:- this.scrollHeightDown, keyEvent: event, startIndex: prevState.startIndex + 1, endIndex: prevState.endIndex + 1, prefixGroup: prevState.startIndex, timeInterval: event.timeStamp };
                    });
                }
            }
        }
    }

    handleKeyPress(event) {
        var keyCode = event.keyCode;
        switch (keyCode) {
            case KeyMap.VK_UP:
                this.handleUpDown(commonConstants.DIRECTION_UP, event);
                break;
            case KeyMap.VK_DOWN:
                this.handleUpDown(commonConstants.DIRECTION_DOWN, event);
                break;
            case KeyMap.VK_ENTER:
                this.setState({
                    keyEvent: {}
                })
                this.props.onEnterPress(this.state.activeProgramId);
                break;
            case KeyMap.VK_RIGHT:
                this.setState({
                    keyEvent: event
                });
                break
            case KeyMap.VK_LEFT:
                if (this.state.gridPositionColumn[this.state.gridPositionRow] === 0 ) {
                    this.props.changeMenuStatus();
                    this.deFocus();
                } else {
                    this.setState({
                        keyEvent: event
                    });
                }
                break
                default:
                break;
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
            prevState.gridPositionColumn[prevState.gridPositionRow] = currentItemFocus;
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
        const ARR = [...this.state.homeGroupings];
        let groupName = "";
        ARR.some((item) => {
            if (item.id === groupId) {
                if(item.i8nLabel){
                    groupName = item.i8nLabel;
                }else{
                    groupName = item.label;
                }
                return true;
            }
            return false;
        });
       return <Trans i18nKey = {groupName}>{groupName} </Trans>;
    }

    /**
    * Description : Get Group Name By Group Id
    * @param {number}  groupId
    * @returns {string}
    */
    getGroupImageType(groupId) {
        const ARR = [...this.state.homeGroupings];
        let imageType = "";

        ARR.some((item) => {
            if (item.id === groupId) {
                imageType = item.imageType;
                return true;
            }
            return false;
        });
        return imageType;
    }

    /**
     * Description : Get Group Wrap By Group Id
     * @param {number}  groupId
     * @returns {string}
     */
    getGroupScrollWrap(groupId) {
        const ARR = [...this.state.homeGroupings];
        let scrollWrap = false;

        ARR.some((item) => {
            if (item.id === groupId) {
                scrollWrap = item.scrollWrap;
                return true;
            }
            return false;
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
            item.images.some(element => {
                if (element.type === imageType) {
                    imageUrl = element.url;
                    dimension = {
                        height: element.height,
                        width: element.width
                    }
                    return true;
                }
                return false;
            });
            return {
                image: imageUrl,
                title: item.title,
                dimension: dimension,
                description: item.shortDescription,
                rating: item.rating,
                amount: CURRENCY + item.price,
                runTime: item.runTime
            }
        });
        return data;
    }

    /**
          * Description : render Home
          *  @returns {JSX}
          */
    render() {
        var style = {
            WebkitTransform: "translate3d(0px," + this.state.scrollY + "px,0)",
            transition: 'all 300ms ease-in-out'
        }
        const CLASS_FORBLUR = this.props.menuOn ? "slide-container-wrapper bluureffects" : "slide-container-wrapper";
        this.prevGridHeight = 0;
        return (<div><div className={CLASS_FORBLUR} data-show="home">
            <div className="home-top-poster">
                <img src="images/poster_top.png" alt="" />
            </div>
            <div className="slider-main-container">
                <div className="sliders-list" style={style}>
                    {
                        this.state.groupWiseSelectables.map((item, index) => {                            //doing windowing
                            if ((index >= this.state.startIndex && index <= this.state.endIndex) || index === this.state.prefixGroup) {
                                return this.renderGroupingSeletables.call(this, item.data, item.groupId, index);
                            }else{
                                return "";
                            }
                         })
                    }
                </div>
            </div>
        </div>
            <div className="home-right-poster"></div>
            <div className="home-bottom-poster"></div></div>);
    }


    /**
    * Description: This method is used for populating grids
    *  @param {object}  selectables 
    * @param {number}   id
    * @param {number}   index 
    * @return {JSX}
    */
    renderGroupingSeletables(selectables, id, index) {
        let selectablesData = this.prepareDataForGrid(selectables, id);

        const ACTIVE_GRID = this.state.gridPositionColumn[index] ? this.state.gridPositionColumn[index] : 0;
        if (selectablesData.length < 1) {
            return "";
        }
        let wrapperActive = index === this.state.gridPositionRow ? "slider-wrapper active" : "slider-wrapper";
        let top = { top: 0 };   
		//setting grid heights
        this.prevGridHeight = index < 1 ? 0:this.state.groupWiseSelectables[index-1].scrollHeight ;
        if(index > 0){
            top = { top: this.prevGridHeight + 'px' };
        }
 
        if(index === this.state.gridPositionRow){
            this.scrollHeightDown = this.state.groupWiseSelectables[index].scrollHeight;
            this.scrollHeightUp = index>1 ? this.state.groupWiseSelectables[index-2].scrollHeight :0;
            if(index-1===0){
                this.scrollHeightUp = 0;
            }
        }

        return (<div key={index} className="slider-row" style={top} > <h2>{this.getGroupNameById(id)}</h2>
            <div className={wrapperActive}  ><HomeHorizontalView dataSource={selectablesData} key={"hori" + index} defaultSelectedPosition={ACTIVE_GRID} onItemSelected={this.itemSelected} maxVisibleItem={this.numberTofetchSeletables} keyEvent={this.state.keyEvent} onFocusChange={this.handleFocusChange} activeEvent={index === this.state.gridPositionRow} loadNextData={this.loadNextData} id={id} isScrollWrap={this.getGroupScrollWrap(id)} />
            </div></div>);
    }

} export default invokeConnect(GroupingGrid, null, 'getGroupings',
    {   //actions
        actionGetSelectables: actionGetSelectables,
    },
    {  //reducers
        reducerRetSelectables: 'getSelectables',
        reducerUiConfig: 'getUiConfig',
        reducerGetUserPreferences: 'userPreferences'
    });

