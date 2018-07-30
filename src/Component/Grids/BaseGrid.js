/**
* Summary: BaseGrid Component 
* Description: Top Most Hierarchy class of the Grid , having common functionality
               of Grid.This class recieve Datasource props.
* @author Akash Sharma
* @date  22.06.2018
*/
import React, { Component } from 'react';
import Utility from '../../commonUtilities';
import { commonConstants } from '../../constants/common.constants';
class BaseGrid extends Component {

    constructor(props) {
        super(props);
        this.dataSource = [];
        this.scrollX = 0;
        this.gridId = this.props.id;
        this.itemWidth = 0;
        this.itemHeight = 0;
        this.itemPadding = 20;
        this.scrollIndex = 0;
        this.SCROLL_SPEED = 300;
        this.scrollDirection;
        this.timeStamp = 310;
        this.keyStopper = false;
        this.circulateCount = 0;
        this.isScrollWrap = false;
        this.state = {
            activeIndex: 0,
            focusLostItemPosition: -1,
            listedData: [],
            scrollIndex: 0,
            transitionSpeed: this.SCROLL_SPEED,
            timeInterval: 0
        }
        this.initData();
        document.addEventListener('keyup', this.keyEventUp);
    }

    /** 
     * initialize values after Constructor calling
     * initial loadData from index 0 to maxVisible item
    */
    initData = () => {
        this.setDataSource();
        this.isScrollWrapping ();
        let toVisibleIndex = this.getMaxVisibleItem() - 1;
        this.loadData(0, toVisibleIndex);
    }

    /**
     * Load Visible data from DataSource to component state(only visible data load in the state)
     * @param {*} fromPos 
     * @param {*} toPos 
     */
    loadData(fromPos, toPos) {
        this.state.listedData = [];
        for (var i = fromPos, j = 0; i <= toPos; i++ , j++) {
            this.state.listedData[j] = this.dataSource[i];
        }
    }

    /**
    * calculate the two indexs from Datasource in forward direction for rendering minimum visible item
    * 1. From Index
    * 2. To Index 
    */
    nextIndexDataLoad(fromVisibleIndex) {
        if ((fromVisibleIndex + (this.getMaxVisibleItem() - 1)) < (this.dataSource.length)) {
            let fromPos = fromVisibleIndex;
            let toPos;
            if ((fromVisibleIndex + (this.getMaxVisibleItem() - 1)) < (this.dataSource.length - 1)) {
                toPos = fromPos + this.getMaxVisibleItem() - 1;
            }
            else {
                toPos = this.dataSource.length - 1;
                if (!Utility.isEmpty(this.props.loadNextData)) {
                    this.props.loadNextData(this.gridId, (data) => {
                        this.dataSource = [...this.dataSource, ...data];
                    })
                }
            }
            if(fromVisibleIndex !== -1){
            this.loadData(fromPos, toPos)
            this.circulateCount=0;
            if (this.state.activeIndex !== 0) {
                this.scrollInit(1)
            }
        }
        } else if ((fromVisibleIndex + (this.getMaxVisibleItem() - 1)) >= (this.dataSource.length) && this.isScrollWrap) {
            if(this.getMaxVisibleItem() >=this.circulateCount){
                this.circulateListedData(this.state.listedData, 1);
                this.scrollInit(1)
            }
            
        }
    }
    
    circulateListedData = (array, times) => {
        array = array.slice();
        while (times--) {
            var temp = array.shift();
            array.push(temp)
        }
        this.state.listedData = array;
        this.state.listedData[this.getMaxVisibleItem() - 1] = this.dataSource[this.circulateCount]
        this.circulateCount++;
    }


    /**
        * calculate the two indexs from Datasource in backward for rendering minimum visible item
        * 1. From Index
        * 2. To Index 
    */
    previousIndexDataLoad(fromVisibleIndex) {
        if (fromVisibleIndex >= 1) {
            let fromPos = fromVisibleIndex - 1;
            let toPos = 0;
            if ((fromPos - 1) + this.getMaxVisibleItem() < this.dataSource.length - 1) {
                toPos = fromPos + (this.getMaxVisibleItem() - 1);
            } else {
                toPos = this.dataSource.length - 1;
            }
            this.loadData(fromPos, toPos)
            this.scrollInit(1);
        }
    }


    /**
    *   calling the Child method give two information , Focus Lost Item and Current focus Item
    * 1.  Focus Lost Item
    * 2.  Current focus Item
    */
    focusChange = () => {
        this.onFocusChange(this.state.focusLostItemPosition, this.state.scrollIndex)
    }

    /**
     * function called from BaseGrid if Child class not override
     * @param {*} focusLostPosition 
     * @param {*} currentItemFocus 
     */
    onFocusChange = (focusLostPosition, currentItemFocus) => {
    }

    /**
     *  calling the onItemSelected function of the child overriden 
     *  Selected Item position
     */
    itemSelected = () => {
        this.onItemSelected(this.state.scrollIndex)
    }

    /**
     * function called from BaseGrid if Child class not override
     * @param {*} position 
     */
    onItemSelected = (position) => {
    }

    /**
     * Return the Default Focus Position from Props if not given then default focus Position will be 0  
     */
    getScrollIndex = () => {
        if (!Utility.isEmpty(this.props.defaultSelectedPosition))
            return parseInt(this.props.defaultSelectedPosition);
        else
            return 0;
    }

    /**
     * Assign the dataSource in BaseGrid property variable from props
     */
    setDataSource() {
        if (!Utility.isEmpty(this.props.dataSource)) {
            this.dataSource = this.props.dataSource;
            this.itemWidth = this.dataSource[0].dimension.width;
            this.itemHeight = this.dataSource[0].dimension.height;
        }
    }

    /**
     *  Return the Maximum Visible item from props
     *  if DataSource length is less than Maximum visible Item ,return the Data source lenth
     */
    getMaxVisibleItem = () => {
        if (!Utility.isEmpty(this.props.maxVisibleItem) && (this.dataSource.length >= this.props.maxVisibleItem))
            return parseInt(this.props.maxVisibleItem);
        else
            return this.dataSource.length;
    }

    isScrollWrapping = () => {
        if (!Utility.isEmpty(this.props.isScrollWrap))
            this.isScrollWrap = this.props.isScrollWrap;
    }


    /**
     * Set the focus position and scrolling value in state when Grid move
     *  @param {*} scrollIndex  passing the focus position
     */
    scrollInit = (scrollIndex) => {
        this.scrollX = 0;
        this.state.activeIndex = 0;
        for (var i = 0; i < scrollIndex; i++) {
            this.state.activeIndex = this.state.activeIndex + 1;
            this.scrollX = this.scrollX - (this.itemWidth + this.itemPadding);
        }
        this.setState({ activeIndex: this.state.activeIndex, SCROOL_SPEED: 0 })
    }

    /**
    * Set the initial focus position and scrolling value in state
    *  @param {*} position  passing the focus position
    */
    setScrollPosition = (position) => {
        if (position !== 0) {
            let toPos = 0;
            if ((position - 1) + this.getMaxVisibleItem() < this.dataSource.length - 1) {
                toPos = (position - 1) + this.getMaxVisibleItem();
            }
            else {
                toPos = this.dataSource.length - 1;
            }
            this.scrollX = this.scrollX - (this.itemWidth + this.itemPadding);
            this.loadData(position - 1, toPos)
            this.setState({ activeIndex: 1, scrollIndex: position })
        }
    }

    /**
     * Key event up
     */
    keyEventUp = (event) => {
        this.keyStopper = false;
        this.SCROLL_SPEED = 300;
    }

    /**
     * Passing the event to Child class
     * activeEvent is mandatory either true or false
     * Handle Long press down Event and Short key Press Event
     */
    keyEvent = (event) => {
        if (Utility.isEmpty(event)) {
            return;
        }
        if (this.keyStopper) {
            if (event.timeStamp - this.timeStamp > 210) {
                this.timeStamp = event.timeStamp;
                this.SCROLL_SPEED = 200;
                if (this.props.activeEvent) {
                    this.handleKeyPress(event);
                }
            }
            return event.keyCode;
        }
        this.keyStopper = true;
        if (this.props.activeEvent) {
            if (event.timeStamp - this.state.timeInterval > 301) {
                this.handleKeyPress(event);
            } else {
                this.onTransitionEnd();
            }
        }
    }

    /**
     * return default Rendering
     */
    getView = (position, activeIndex, dataObject) => {
        return (<h1>Welcome React Grid</h1>)
    }

    /**
     * Listening event from Screen 
     */
    componentDidUpdate(prevProps, prevState) {
        if (prevState.scrollIndex === this.state.scrollIndex) {
            this.keyEvent(this.props.keyEvent);
        }
    }

    /**
     * Return the Rendered View Items
     * if the active event true will pass the active Index for focus, otherwise grid will be not focus
     */
    renderItem = () => {
        return (
            this.state.listedData.map((item, i) => {
                if (i < this.getMaxVisibleItem())
                    if (this.props.activeEvent) {
                        return this.getView(i, this.state.activeIndex, item);
                    } else {
                        return this.getView(i, -1, item);
                    }
            }))
    }

    /**
     * Return the dynamic style for Slider 
     */
    sliderStyle() {
        var style = {
            transform: "translate3d(" + this.scrollX + "px,0,0)",
            width: ((parseInt(this.getMaxVisibleItem())) * (this.itemWidth + this.itemPadding) + 'px'),
            transition: "all " + this.state.SCROOL_SPEED + "ms linear",
        }
        return style;
    }

    /**
     * handle the transition and focus on next item
     * @returns : none
     */
    onTransitionEnd = () => {
        if (this.scrollDirection === commonConstants.GRID_DIRECTION_RIGHT) {
            this.nextIndexDataLoad(this.state.scrollIndex - 1);
        }
        else if ((this.state.activeIndex <= 1) && (this.scrollDirection === commonConstants.GRID_DIDECTION_LEFT)) {
            this.previousIndexDataLoad(this.state.scrollIndex)
        }
    }

    activeDetailStyle() {
        if (this.itemHeight === 300)
            return { height: "190px" };
        else if (this.itemHeight === 180)
            return { height: "290px" };
    }

    leftArrowStyle() {
        if (this.itemHeight === 180)
            return { top: "90px" };
    }



    /**
     * Life cycle method of component class
     * Render all Item Views in Slider 
     */
    render() {
        return (
            <Hoc>
                <ul id={this.gridId} className="slider" style={this.sliderStyle()} onTransitionEnd={this.onTransitionEnd}>
                    {this.renderItem()}
                </ul>
                {this.props.activeEvent &&
                    <span>
                        {this.state.scrollIndex === 0 && <div className="arrow left-arrow" style={this.leftArrowStyle()}></div>}
                        <div className="active-details" style={this.activeDetailStyle()}>
                            <div className="left-col">
                                <div className="heading-row">
                                    <h3>{this.dataSource[this.state.scrollIndex].title}</h3> <span className="btn-style">{this.dataSource[this.state.scrollIndex].rating}</span> <span className="time">{Utility.timeFormat (this.dataSource[this.state.scrollIndex].runTime)}</span> <span className="price">{this.dataSource[this.state.scrollIndex].amount}</span>
                                </div>
                                <p>{this.dataSource[this.state.scrollIndex].description}</p>
                            </div>
                            <div className="key-action-details">Press OK <br />to view and <br />order</div>
                        </div>
                    </span>
                }
            </Hoc>
        )
    }

    /**
     * Life cycle method of component class
     */
    componentDidMount() {
        this.setScrollPosition(this.getScrollIndex());
    }

    /**
     * Life cycle method of component class
     * unregister the Keyup event
     */
    componentWillUnmount() {
        document.removeEventListener('keyup', this.keyEventUp);

    }
}
const Hoc = (props) => props.children;
export default BaseGrid;