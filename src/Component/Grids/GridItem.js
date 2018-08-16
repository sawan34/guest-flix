/**
* Summary: Item View for Grid
* Description : Function return the Single Item View, which would be rencder on Grid 
* @author Akash Sharma
* @date  22.06.2018
*/
import React from 'react';
import commonUtility from '../../commonUtilities';

export default function GridItem(props) {
  var itemstyle = {
    width: parseInt(props.data.dimension.width,10),
    height: parseInt(props.data.dimension.height,10)
  }
  return (
    <li key={props.i} id={props.i} className={props.i === props.active ? props.data.dimension.width > props.data.dimension.height ? "list-item active-landscape" : "list-item active" : "list-item"} style={itemstyle}>
      <img src={props.data.image} style={itemstyle} onError={commonUtility.onImageErrorHandler}  />
    </li>)
}
