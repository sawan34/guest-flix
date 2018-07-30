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

    constructor(){
        super();
        this.onKeyDown = this.onKeyDown.bind(this); 
    }

    /**
     * this function is responsible for processing the data and show
         it into loverlay
     * @param {} data: It consist the data to be rendered in overlay
     */
    processingData = (data) => {

    }

    /**
     * This function is responsible for creating the structure if such is resuired
     * @param {} style : style is responsible for different different layout of overlay. 
     */
    setLayoutStr = (style) => {

    }

    onKeyDown(event) {
        try {
            var keyCode = event.keyCode;

            switch (keyCode) {
                case KeyMap.VK_BACK:
                    this.props.closePopup();
                    break;
                default:
                    this.props.keyhandler(keyCode);
                    break;
            }
        } catch (e) {

        }
    }

    componentWillUnmount() {
        document.removeEventListener("keydown", this.onKeyDown);
    }

    componentDidMount() {
        document.addEventListener("keydown", this.onKeyDown);
    }

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
