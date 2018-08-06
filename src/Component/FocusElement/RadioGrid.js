/**
* Summary: Radio Grid Component
* Description: This is Radio Grid Class extend to Grid and Creating Radio items
* @author Shashi Kapoor Singh
* @date  24.07.2018
*/
import React from 'react';
import FocusElement from "./FocusElement";
import RadioItem from './RadioItem';

class RadioGrid extends FocusElement {
    /**
    * Description: class initialization 
    * @param {null} 
    * @return {null}
    */
    constructor(props) {
        super(props);
    }

    /** Description: prepare grid item
     * @param {item} object
     * @param {colindex} number
     * @param {rowindex} number
     * @return {null}
   */
    getView(item, colindex, rowindex, gridname) {
        let rowIndexNum = -1;
        if (this.props.isKeyEvent) {
            rowIndexNum = rowindex
        }
        return <RadioItem isActiveClass={this.isActiveClass} gridname={gridname} key={colindex} onChange={this.props.onChange} rowindex={rowIndexNum} colindex={colindex} item={item} />;
    }

}

export default RadioGrid;