/**
* Summary: BaseGrid Component 
* Description: Top Most Hierarchy class of the Grid , having common functionality
               of Grid.This class recieve Datasource props.
* @author Akash Sharma
* @date  22.06.2018
*/
import React, { Component } from 'react';
import Utility from '../../commonUtilities';

class BaseGrid extends Component {

    constructor(props) {
        super(props);
        this.dataSource = [];
        this.scrollX = 0;
        this.gridId = this.props.id;
        this.itemWidth = 250;
        this.itemPadding = 20;
        this.scrollIndex = 0;
        this.SCROLL_SPEED = 300;
        this.scrollDirection;
            this.state = {
                activeIndex: 0,
                focusLostItemPosition: -1,
                listedData: [],
                scrollIndex: 0,
                transitionSpeed: this.SCROLL_SPEED,
            }
        this.initData();
       // document.addEventListener('keydown', this.keyEvent);
    }

    /** 
     * initialize values after Constructor calling
    */
    initData = () => {
        this.setDataSource();
        let toVisibleIndex = this.getMaxVisibleItem() - 1;
        this.loadData(0, toVisibleIndex);
    }

    /**  Not in Use now
     * Load Visible data from DataSource to component state(only visible data load in state)
     * @param {*} fromPos 
     * @param {*} toPos 
     */
    loadData(fromPos, toPos) {
        this.state.listedData = [];
        for (var i = fromPos, j = 0; i <= toPos; i++ , j++) {
            this.state.listedData[j] = this.dataSource[i];
        }
        //this.setState({ listedData: this.state.listedData,tranlateNow: true })
    }


    /** Not in Use now
    * calculate the two indexs from Datasource  for rendering minimum visible item
    * 1. From Index
    * 2. To Index 
    */
    nextIndexDataLoad(fromVisibleIndex) {
        console.log("get Load Data");
        if ((fromVisibleIndex + (this.getMaxVisibleItem() - 1)) < (this.dataSource.length)) {
            let fromPos = fromVisibleIndex;
            let toPos;
            if ((fromVisibleIndex + (this.getMaxVisibleItem() - 1)) < (this.dataSource.length - 1)) {
                toPos = fromPos + this.getMaxVisibleItem() - 1;
            }
            else {
                toPos = this.dataSource.length;
                if (!Utility.isEmpty(this.props.loadNextData)) {
                    this.props.loadNextData(this.gridId, (data) => {
                        debugger;
                        this.dataSource = [...this.dataSource, ...data];
                    })
                }
            }

            this.loadData(fromPos, toPos)
            if (this.state.activeIndex !== 0) {
                this.scrollInit(1)
            }
        }
    }


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
        if (!Utility.isEmpty(this.props.dataSource))
            this.dataSource = this.props.dataSource;
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


    /**
     * Set the focus position in state
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
     * Passing the event to Child class
     * activeEvent is mandatory either true or false
     */
    keyEvent = (event) => {
        if (this.props.activeEvent) {
            this.handleKeyPress(event);
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
        if (prevState.activeIndex === this.state.activeIndex) {
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
        if (this.scrollDirection==='RIGHT') {
            this.nextIndexDataLoad(this.state.scrollIndex - 1);
        }
        else if ((this.state.activeIndex <= 1) && (this.scrollDirection==='LEFT')) {
            this.previousIndexDataLoad(this.state.scrollIndex)
        }
    }


    /**
     * Life cycle method of component class
     * Render all Item Views in Slider 
     */
    render() {
        return (
            <div >
                <ul id="animation-root" className="slider" style={this.sliderStyle()} onTransitionEnd={this.onTransitionEnd}>
                    {this.renderItem()}
                </ul>
            </div>
        )
    }

    /**
     * Life cycle method of component class
     */
    componentDidMount() {
        this.setScrollPosition(this.getScrollIndex());
    }
}
export default BaseGrid;