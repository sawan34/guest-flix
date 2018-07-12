/**
* Summary: Item View for Grid
* Description : Function return the Single Item View, which would be rencder on Grid 
* @author Akash Sharma
* @date  22.06.2018
*/
import React from 'react';

export default function GridItem(props) {
  return (
    <li key={props.i} id={props.i} className={props.i === props.active ? "list-item active" : "list-item"}>
       <img src={props.data.image} />
   </li>)
}