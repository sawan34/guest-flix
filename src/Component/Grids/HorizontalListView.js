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
import KeyMap from '../../constants/keymap.constant';
import Utility from '../../commonUtilities';
import { commonConstants } from '../../constants/common.constants'

class HorizontalListView extends BaseGrid {

    /**
     * Function is called from baseGrid Class and passing event
     * @param {*} event  Handling KeyCode event for Left,Right,up,down and Enter Key
     */
    handleKeyPress = (event) => {
        const keyCode = event.keyCode;
        switch (keyCode) {
            case KeyMap.VK_RIGHT:
                this.goNext(event);
                break;
            case KeyMap.VK_LEFT:
                if (this.state.activeIndex === 0) {
                    return;
                }
                this.goPrevious(event);
                break;
            case KeyMap.VK_ENTER:
                this.onItemSelected()
                break;
            case KeyMap.VK_UP:
            case KeyMap.VK_DOWN:
                this.focusChange();
                break;
            default:
                break;
        }
    }

    /**
    * @override BaseGrid
    * Get props function call back
    */
    onFocusChange = (focusLostPosition, currentItemFocus) => {
        if (!Utility.isEmpty(this.props.onFocusChange))
            this.props.onFocusChange(focusLostPosition, currentItemFocus);
    }

    /**
      * @override BaseGrid
      * Get props function call back
      */
    onItemSelected = (position) => {
    }

    /**
     * Override method  Return the Item UI
     * Return the item with complete Data format
     * @param {*} position   which item is going to be render
     * @param {*} activeIndex for focus item
     * @param {*} dataObject  single object with three attribute(id,title,image)
     */
    getView = (position, activeIndex, dataObject) => {
        if (!Utility.isEmpty(dataObject))
            return (<VerticalItem key={dataObject.index+"vert"} i={position} active={activeIndex} data={dataObject} />);
    }
}
export default HorizontalListView;