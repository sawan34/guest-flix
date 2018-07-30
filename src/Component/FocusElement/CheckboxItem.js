/**
* Summary: Checkbox Item
* Description: This is Checkbox Item function for creating single item
* @author Shashi Kapoor Singh
* @date  24.07.2018
*/
import React from 'react';

export default function CheckboxItem(props) {
    return Object.keys(props.item).map((val) => {
        return Object.values(props.item).map((obj) => {
            return <div className={props.isActiveClass(props.rowindex, props.colindex) ? 'form-group active' : 'form-group'} key={"lang" + props.rowindex + props.colindex}>
                <input type="checkbox" checked={obj.status} id={obj.id} onChange={props.onChange} />
                <label htmlFor={obj.id}>{val}</label>
            </div>
        })

    })


}
