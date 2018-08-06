/**
* Summary: Checkbox Item
* Description: This is Checkbox Item function for creating single item
* @author Shashi Kapoor Singh
* @date  24.07.2018
*/
import React from 'react';

export default function CheckboxItem(props) {
    return <div className={props.isActiveClass(props.rowindex, props.colindex) ? 'form-group active' : 'form-group '} key={"lang" + props.rowindex + props.colindex}>
                <input type="checkbox" checked={props.item.status} id={props.item.id} onChange={props.onChange} />
                <label htmlFor={props.item.id}>{props.item.value}</label>
            </div>
}
