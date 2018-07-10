/**
* Summary: Home Screen Component
* Description: This is home screen created by extending base Screen
* @author Sawan Kumar
* @date  22.06.2018
*/
import React from 'react';
import BaseScreen, { invokeConnect } from './BaseScreen';
import KeyMap from '../../constants/keymap'
import { translate, Trans } from 'react-i18next';
import { SCREENS } from '../../constants/screens.constant';
import { actionGetSelectables } from '../../actions';
import { alertConstants } from '../../constants/alert.constant';
import Menu from '../../Component/Menu/Menu';

import HomeHorizontalView from '../../Component/Grids/HorizontalListView'

class Home extends BaseScreen {

    constructor() {
        super();
        this.state = {
            ...this.state,
            screen: SCREENS.home,//This is mandatory for all the screens 
            keyEvent: {},
            groupWiseSelectables: [],
            gridPosition: 0,
            numberOfGrouping: 0,
            scrollY: 0,
            homeGroupings:[],
        }
        this.menuOn = false ;
        this.topPosition = 0;
    }

    /**
    * Get the Selected item position
    */
    itemSelected = (position) => {
    }

    /**
     * 
     */
    shouldComponentUpdate(nextProps, nextState) {
        return true;
    }

      /**
     * Description:Setting  Menu status On || Off 
     */
    changeMenuStatus(event = null) {
        this.menuOn = !this.menuOn;
    }

    /**
     * 
     */
    componentDidMount(){
        let promises = [],selfThis = this; // this variable for promise which is new object
        if(this.props.networkData.type===alertConstants.SUCCESS && alertConstants.SUCCESS===this.props.uiConfig.type){
            //parsing on home Grouping from All grouping
            const homeGroupingIds = this.props.uiConfig.message.data.homeGroupings;
            this.state.homeGroupings = this.props.networkData.message.data.filter((item)=>{
                if(item.selectables.length < 1){
                    return false;
                }
                if(homeGroupingIds.indexOf(item.id)>=0){
                    return true;
                }
            });
        }

        if (this.state.homeGroupings.length > 0) {
            promises =   this.state.homeGroupings.map(function (item) {
               return  new Promise(function(resolve, reject) {
                resolve(selfThis.props.actionGetSelectables.call(null, item.selectables,item.id))
              });
            });
            Promise.all([...promises]).then(function(values) {
                selfThis.setState((prevState)=>{
                    return {
                        groupWiseSelectables:selfThis.props.getSelectables,
                        numberOfGrouping:selfThis.props.getSelectables.length
                    }
                })
              });
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
                this.handleUpDown("up",event);
                break;
            case KeyMap.VK_DOWN:
                    this.handleUpDown("down",event);
                break;
            case KeyMap.VK_ENTER:
                this.goToScreen(SCREENS.programdetails+"/"+1001, null);
            break; 
                case KeyMap.VK_INSERT:
                this.changeMenuStatus(event)
                break

            default:
                this.setState({ keyEvent: event });
            break;
        }
    }
    /**
    * Description: This Could handle Up and Down
    * @param {string}  direction 
    * @param {object}  Event 
    * @return {null}
    */
    handleUpDown = (direction,event) => {
        if (direction === "up") {
            if (this.state.gridPosition > 0) {
                this.setState((prevState) => {
                    return { gridPosition: prevState.gridPosition - 1, scrollY: prevState.scrollY + 690,keyEvent:event };
                });
            }
        }

        if (direction === "down") {
            if (this.state.gridPosition < this.state.numberOfGrouping - 1) {
                this.setState((prevState) => {
                    return { gridPosition: prevState.gridPosition + 1, scrollY: prevState.scrollY - 690,keyEvent:event };
                });
            }
        }
    }

    /**
     * Description: This method callback is going to be used for Focus positions
     *  @param {number}  focusLostPosition 
     * @param {number}  currentItemFocus 
     * @return {null}
     */
    handleFocusChange(focusLostPosition, currentItemFocus) {

    }

     /**
     * Description: This method is used for populating grids
     *  @param {object}  selectables 
     * @param {number}  i 
     * @return {JSX}
     */
    renderGroupingSeletables(selectables,i) {
        let selectablesData = selectables.map((item,index)=>{
            return {
                image:item.images[0].url,
                title:item.title
            }
        });

        const maxVisibleItem = selectablesData.length > 1 ? selectablesData.length : 1;
        if (selectablesData.length < 1) {
            return "";
        }
        let wrapperActive = i === this.state.gridPosition ? "slider-wrapper active":"slider-wrapper";
        let top = {top:0} ;
        if(i>0){
            this.position = 690 *i;
            top = {top:this.position+'px'} ;
        }
        return (<div key={i} className="slider-row" style = {top} > <h2>{this.state.homeGroupings[i].label}</h2><div className={wrapperActive}><HomeHorizontalView dataSource={selectablesData} defaultSelectedPosition="0" onItemSelected={this.itemSelected} maxVisibleItem={maxVisibleItem} keyEvent={this.state.keyEvent} onFocusChange={this.handleFocusChange} activeEvent={i === this.state.gridPosition} />
         {i === this.state.gridPosition && 
        <span>
        <div className="arrow left-arrow"></div>
        <div className="active-details">
            <div className="left-col">
                <div className="heading-row">
                    <h3>Jurassic World</h3> <span className="btn-style">PG</span> <span className="time">2h 04m</span> <span className="price">$9.99</span>
                </div>
                <p>A new theme park, built on the original site of Jurassic Park, creates a genetically modified hybrid dinosaur, which escapes containment and goes on a killing spree.</p>
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
        if (this.state.groupWiseSelectables.length ===0) {
            return <div><p><Trans i18nKey="loadingData">Loading Data ...</Trans> </p></div>
        }
        if (this.state.data.type === alertConstants.ERROR) {
            return <div>{this.state.data.data}</div>
        }

        var style = {
            transform: "translate3d(0px," + this.state.scrollY  + "px,0)",
            transition: 'all 300ms ease-in-out'
        }
        
        return (
            <div>
            <div className="container" >
            <Menu keyEvent={this.state.keyEvent} changeMenuStatus={this.changeMenuStatus.bind(this)} />
                <div className="slide-container-wrapper" data-show="home">
                    <div className="home-top-poster">
                        <img src="images/poster_top.png" />
                    </div>
                    <div className="slider-main-container">
                    <div className="sliders-list" style={style}>
                        {
                            this.state.groupWiseSelectables.map((item, i) => {
                                return this.renderGroupingSeletables.call(this, item.data,i);
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
export default invokeConnect(Home, null, 'getGrouings',
                                {actionGetSelectables:actionGetSelectables},{
                                                                getSelectables:'getSelectables',
                                                                uiConfig:'getUiConfig' });
