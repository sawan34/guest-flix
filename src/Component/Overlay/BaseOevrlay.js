/**
* Summary: BaseOverlay Component 
* Description: 
* @author Dharmveer
* @date  16.07.2018
*/

//import React, {Component} from 'react;
import React, { Component } from 'react';
import KeyMap from '../../constants/keymap.constant';
//import { connect } from "react-redux";

export default class BaseOverlay extends Component {
  /**
     * This function is responsible for creating overLay on any layer.
     * @param {} none: 
     */
    render() {
        return (
            <div className="sub-menu" style={this.props.show} className={this.props.myClass}>
                <div className="movie-list">
                    {this.props.children &&
                        this.props.children
                    }
                </div>
            </div>
        )

    }
}
