/**
* Summary: Radio Item
* Description: This is Radio Item function for creating single item
* @author Shashi Kapoor Singh
* @date  24.07.2018
*/
import React from 'react';

export default function RadioItem(props) {
    return <div className={props.isActiveClass(props.rowindex, props.colindex) ? 'radio-group active' : 'radio-group'} key={"lang" + props.rowindex + props.colindex}>
                <input type="radio" name={props.gridname} checked={props.item.status} id={props.item.id} onChange={props.onChange} />
                <label htmlFor={props.item.id}>{props.item.value}</label>
            </div>
}