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
        this.state = {
            activeIndex: 0,
            focusLostItemPosition: -1,
        }
        this.initData();
    }

    /** 
     * initialize Grid values after Constructor calling
    */
    initData = () => {
        this.setDataSource();
    }

    /**
    *  call by Left and right key Event 
    */
    focusChange = () => {
        this.onFocusChange(this.state.focusLostItemPosition, this.state.activeIndex)
    }

    /**
     * function called from BaseGrid if Child class not override
     * @param {*} focusLostPosition 
     * @param {*} currentItemFocus 
     */
    onFocusChange = (focusLostPosition, currentItemFocus) => {
    }

    /**
     * Give the selected item position 
     */
    itemSelected = () => {
        this.onItemSelected(this.state.activeIndex)
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
     *  if DataSource length is less than Maximum visible Item , default max visible will be datasource length
     */
    getMaxVisibleItem = () => {
        if (!Utility.isEmpty(this.props.maxVisibleItem) && (this.dataSource.length >= this.props.maxVisibleItem))
            return parseInt(this.props.maxVisibleItem);
        else
            return this.dataSource.length;
    }

    /**
     * Set the focus position 
     * @param {*} scrollIndex  
     */
    setScrollViewPosition = (scrollIndex) => {
        for (var i = 0; i < scrollIndex; i++) {
            this.state.activeIndex = this.state.activeIndex + 1
            this.scrollX = this.scrollX - (this.itemWidth + this.itemPadding)
        }
        this.setState({ activeIndex: this.state.activeIndex })
    }

    /**
     * Passing the event to Child class
     * activeEvent is mandatory either true or false
     */
    keyEvent = (event) => {
        if (this.props.activeEvent && event) {
            this.handleKeyPress(event);
        }
    }

    /**
     * return one default Render Item
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
     * Return the Rendered View Items based on activeEvent props
     */
    renderItem = () => {
        return (
            this.dataSource.map((item, i) => {
                if (i < this.getMaxVisibleItem())
                    if (this.props.activeEvent) {
                        return this.getView(i, this.state.activeIndex, item);
                    }
                    else {
                        return this.getView(i, -1, item);
                    }
            }))
    }

    /**
     * Return the style for Slider 
     */
    sliderStyle() {
        var style = {
            transform: "translate3d(" + this.scrollX + "px,0,0)",
            width: ((parseInt(this.getMaxVisibleItem())) * (this.itemWidth + this.itemPadding) + 'px'),
        }
        return style;
    }

    /**
     * Life cycle method of component class
     * Render all Item Views in Slider 
     */
    render() {
        return (
            <div >
                <ul id={this.gridId} className="slider" style={this.sliderStyle()} >
                    {this.renderItem()}
                </ul>
            </div>
        )
    }

    /**
     * set default Scroll Position
     */
    componentDidMount() {
        this.setScrollViewPosition(this.getScrollIndex());
    }
}
export default BaseGrid;