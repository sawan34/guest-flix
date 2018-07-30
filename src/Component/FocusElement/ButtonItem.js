/**
* Summary: Button Item
* Description: This is Button Item function for creating single item
* @author Shashi Kapoor Singh
* @date  24.07.2018
*/
import React from 'react';
import { Trans } from 'react-i18next';

export default function ButtonItem(props) {
    return <div className={props.isActiveClass(props.rowindex, props.colindex) ? 'item active' : 'item'} key={"lang" + props.rowindex + props.colindex}>
        <button id={props.item.label} className="btn-popup"><Trans i18nKey={props.item.label}></Trans></button>

    </div>
}
