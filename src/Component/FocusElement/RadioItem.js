/**
* Summary: Radio Item
* Description: This is Radio Item function for creating single item
* @author Shashi Kapoor Singh
* @date  24.07.2018
*/
import React from 'react';

export default function RadioItem(props) {
    return Object.keys(props.item).map((val) => {
        return Object.values(props.item).map((obj) => {
            return <div className={props.isActiveClass(props.rowindex, props.colindex) ? 'radio-group active' : 'radio-group'} key={"lang" + props.rowindex + props.colindex}>
                <input type="radio" name={props.gridname} checked={obj.status} id={obj.id} onChange={props.onChange} />
                <label htmlFor={obj.id}>{val}</label>
            </div>
        })

    })


}
