/**
* Summary: Button Grid Component
* Description: This is Button Grid Class extend to Grid and Creating button items
* @author Shashi Kapoor Singh
* @date  24.07.2018
*/
import React from 'react';
import Grid from "./FocusElement";
import ButtonItem from './ButtonItem';

class ButtonGrid extends Grid {
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
    getView(item, colindex, rowindex) {
        if (this.props.isKeyEvent) {
            return <ButtonItem key={colindex} isActiveClass={this.isActiveClass} rowindex={rowindex} colindex={colindex} item={item} />;
        } else {
            return <ButtonItem key={colindex} isActiveClass={this.isActiveClass} rowindex={-1} colindex={colindex} item={item} />;
        }
    }
}

export default ButtonGrid;