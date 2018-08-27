/**
* Summary: Checkbox Grid Component
* Description: This is Checkbox Grid Class extend to Grid and Creating checkbox items
* @author Shashi Kapoor Singh
* @date  24.07.2018
*/
import React from 'react';
import FocusElement from "./FocusElement";
import CheckboxItem from './CheckboxItem';

class CheckboxGrid extends FocusElement {
    /** Description: prepare grid item
     * @param {item} object
     * @param {colindex} number
     * @param {rowindex} number
     * @return {null}
   */
    getView(item, colindex, rowindex) {
        if (this.props.isKeyEvent) {
            return <CheckboxItem isActiveClass={this.isActiveClass} key={colindex} onChange={this.props.onChange} rowindex={rowindex} colindex={colindex} item={item} />;
        } else {
            return <CheckboxItem isActiveClass={this.isActiveClass} key={colindex} onChange={this.props.onChange} rowindex={-1} colindex={colindex} item={item} />;
        }
    }
}

export default CheckboxGrid;