/**
* Summary: HorizontalList Component 
* Description: This class extends the BaseGrid and handles the key code i.e. left,right and enter
               Must return the item view in this class in getView Method.
               This component can use by two type either extends it or Directly use as tag Element
* @author Akash Sharma
* @date  22.06.2018
*/
import React from 'react';
import VerticalItem from './GridItem'
import BaseGrid from './BaseGrid'
import KeyMap from '../../constants/keymap';
class HorizontalListView extends BaseGrid {

    /**
     * Function is called from baseGrid Class and passing event
     * @param {*} event  Handling KeyCode event for Left,Right and Enter Key
     */
    handleKeyPress= (event)=>  {
        const keyCode = event.keyCode;
        switch (keyCode) {
            case KeyMap.VK_RIGHT:
                if (this.state.activeIndex >= this.getMaxVisibleItem() - 1) {
                    return;
                }
                this.state.focusLostItemPosition = this.state.activeIndex;
                this.state.activeIndex = this.state.activeIndex + 1
                this.scrollX = this.state.scrollX - (250 + 20)
                this.setState({ focusItemPosition: this.state.activeIndex ,focusLostItemPosition: this.state.focusLostItemPosition, activeIndex: this.state.activeIndex, scrollX: this.scrollX })
                this.focusChange()
                break;
            case KeyMap.VK_LEFT:
                if (this.state.activeIndex === 0) {
                    return;
                }
                this.state.focusLostItemPosition = this.state.activeIndex;
                this.state.activeIndex = this.state.activeIndex - 1
                this.scrollX = this.state.scrollX + (250 + 20)
                this.setState({ focusItemPosition: this.state.activeIndex ,focusLostItemPosition: this.state.focusLostItemPosition, activeIndex: this.state.activeIndex, scrollX: this.scrollX })
                this.focusChange()
                break;
            case KeyMap.VK_ENTER:
                this.itemSelected()
                break;
        }
    }


    /**
    * @override BaseGrid
    * function calls the override function by props
    */
    onFocusChange = (focusLostPosition, currentItemFocus) => {
        if (this.props.onFocusChange !== undefined)
            this.props.onFocusChange(focusLostPosition, currentItemFocus);
    }

    /**
      * @override BaseGrid
      * function calls the override function by props
      */
    onItemSelected = (position) => {
         if (this.props.onItemSelected !== undefined)
            this.props.onItemSelected(this.state.activeIndex);
    }

    /**
     * Override method for Returning the Item UI
     * Return the item with complete Data format
     * @param {*} position   which item is going to be render
     * @param {*} activeIndex for focus item
     * @param {*} dataObject  single object with three attribute(id,title,image)
     */
    getView = (position, activeIndex, dataObject) => {
        return (<VerticalItem key={position} i={position} active={activeIndex} data={dataObject} />)
    }
}
export default HorizontalListView;