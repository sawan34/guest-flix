/**
* Summary: Item View for Grid
* Description : Function return the Single Item View, which would be rencder on Grid 
* @author Akash Sharma
* @date  22.06.2018
*/
import React from 'react';
import commonUtility from '../../commonUtilities';

export default function GridItem(props) {
  console.log("Grid Item render")
  var itemstyle = {
    width: parseInt(props.data.dimension.width,10),
    height: parseInt(props.data.dimension.height,10)
  }
  return (
    <li key={props.data.index} id={props.data.index} className={props.data.index === props.active ? props.data.dimension.width > props.data.dimension.height ? "list-item active-landscape" : "list-item active" : "list-item"} style={itemstyle}>
      <img alt={props.i} src={props.data.image} style={itemstyle}  onError={(e)=>{ 
        props.data.image = 'images/no-image.png';
        e.target.src = 'images/no-image.png';}}  />
    </li>)
}
