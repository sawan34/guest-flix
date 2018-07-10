/**
* Summary: BaseGrid Component 
* Description: Top Most Hierarchy class of the Grid , having common functionality
               of Grid.This class recieve Datasource props.
* @author Akash Sharma
* @date  22.06.2018
*/
import React, { Component } from 'react';

class BaseGrid extends Component {

    constructor(props) {
        super(props);
        this.dataSource = [];
        this.itemlist = [];
        this.scrollX = 0;
        this.gridId = this.props.id;
        this.state = {
            activeIndex: 0,
            scrollX: 0,
            focusItemPosition: 0,
            focusLostItemPosition: -1,
            itemWidth: 0,
        }
        this.initData();
    }

    /** 
     * initialize values after Constructor calling
    */
    initData = () => {
        this.setDataSource();
    }

    /**
    *   calling the Child method give two information , Focus Lost Item and Current focus Item
    * 1.  Focus Lost Item
    * 2.  Current focus Item
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
     *  calling the onItemSelected function of the child overriden 
     *  Selected Item position
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
        if (this.props.defaultSelectedPosition !== undefined)
            return this.props.defaultSelectedPosition;
        else
            return 0;
    }

    /**
     * Assign the dataSource in BaseGrid property variable from props
     */
    setDataSource() {
        if (this.props.dataSource !== undefined)
            this.dataSource = this.props.dataSource;
    }

    /**
     *  Return the Maximum Visible item from props
     *  if DataSource length is less than Maximum visible Item ,return the Data source lenth
     */
    getMaxVisibleItem = () => {
        if (this.props.maxVisibleItem !== undefined) {
            if (this.dataSource.length >= this.props.maxVisibleItem)
                return this.props.maxVisibleItem;
            else
                return this.dataSource.length;
        }
    }

    /**
     * Set the focus position in state
     */
    setScrollViewPosition = () => {
        for (var i = 0; i < this.getScrollIndex(); i++) {
            this.state.activeIndex = this.state.activeIndex + 1
            this.scrollX = this.scrollX - (this.state.itemWidth + 20)
        }
        this.setState({ activeIndex: this.state.activeIndex, scrollX: this.scrollX })
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
        if (prevState.focusItemPosition === this.state.focusItemPosition) {
            this.keyEvent(this.props.keyEvent);
        }
    }

    /**
     * Return the Rendered View Items
     * if the active event true will pass the active Index for focus, otherwise grid will be not focus
     */
    renderItem = () => {
        return (
            this.itemlist = this.dataSource.map((item, i) => {
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
     * Return the dynamic style for Slider 
     */
    sliderStyle() {
        var style = {
            transform: "translate3d(" + this.state.scrollX + "px,0,0)",
            width: ((parseInt(this.getMaxVisibleItem())) * (250 + 20) + 'px'),
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
     * Life cycle method of component class
     * Read document after rendering and set states
     */
    componentDidMount() {
        this.setScrollViewPosition();
    }
}
export default BaseGrid;