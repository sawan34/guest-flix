/**
 * Summary: Player control Component
 * Description: Control playback as play ,pause ,Rewind,Forword,Languag and Exit and Bookmark
 * @author Akash Kumar Sharma
 * @date  02.08.2018
 */
import React, { Component } from 'react';
import { Trans } from 'react-i18next';
import TvComponent from '../TvComponent'
import KeyMap from '../../constants//keymap.constant';
import _ from 'lodash';
const PlayerControls = {
    "PLAY": "PLAY",
    "PAUSE": "PAUSE",
    "FORWARD": "FORWARD",
    "REWIND": "REWIND",
    "LANGUAGE": "LANGUAGE"
}
class PlayerControl extends TvComponent {

    constructor(props) {
        super(props)
        this.movieTitle = this.props.title;
        this.playPause = this.playPause.bind(this);
        this.forward = this.forward.bind(this);
        this.backward = this.backward.bind(this);
        this.onSelectLanguageMenu = this.onSelectLanguageMenu.bind(this);
        this.onSelectBookmarkAndExit = this.onSelectBookmarkAndExit.bind(this);
        this.resetFocus = this.resetFocus.bind(this);
        this.playerControl = [];
        this.elementPlayPause = null;
        this.elementForward = null;
        this.elementRewind = null;
        this.bookMarkAndExitView = null;
        this.selectedControl = null;
    }


    componentDidMount() {
        super.componentDidMount();
        this.getDomElements();
        this.playerControl = _.map(this.playerControl);
        this.selectedControl = PlayerControls.PLAY;
        this.elementPlayPause.className = "play active";
    }


    getDomElements() {
        this.playerControl = document.getElementById('playerCtrl').childNodes;
        this.elementPlayPause = document.getElementById("playpause");
        this.elementForward = document.getElementById("forward");
        this.elementRewind = document.getElementById("rewind");
        this.bookMarkAndExitView = document.getElementsByClassName("btn-exit");
    }

    /**
    * Description: fire Play event for video player
    * @param {null} 
    * @return {null}
    */
    playPause() {
        this.props.playPause();
    }
    /**
    * Description: fire forward event for video player
    * @param {null} 
    * @return {null}
    */
    forward() {
        this.props.forward();
    }
    /**
    * Description: fire rewind event for video player
    * @param {null} 
    * @return {null}
    */
    backward() {
        this.props.backward();
    }

    /**
     *  Description: fire on select language event
     */
    onSelectLanguageMenu() {
        this.props.onSelectLanguageMenu();
    }

    /**
     *  Description: fire on Select Bookmark and Exit option of Player control
     */
    onSelectBookmarkAndExit() {
        this.props.onSelectBookmarkAndExit();
    }

    /**
    * Description: reset player control button's css layout
    * @param {null} 
    * @return {null}
    */
    resetFocus() {
        let selectedElement = this.playerControl.filter(elem => elem.classList.contains('active'));
        for (let i = 0; i < selectedElement.length; i++) {
            selectedElement[i].classList.remove('active');
            selectedElement[i].classList.remove("open-menu");
        }
        this.elementForward.className = "FF";
        this.elementRewind.className = "RW";
        this.bookMarkAndExitView[0].classList.remove("active");
    }

    /**
    * Description: Reset the Active posion based on selected item
    * @param {keycode} 
    * @return {null}
    */
    selectItem(keyCode) {

        let selectedIndex = 0;
        for (let i = 0; i < this.playerControl.length; i++) {
            if (this.playerControl[i].classList.contains('active')) {
                selectedIndex = i;
                break;
            }
        }
        if (keyCode === KeyMap.VK_RIGHT) {
            if (selectedIndex >= 0 && selectedIndex < 3) {
                this.setAttribute(selectedIndex + 1);
            }
        }
        else if (keyCode === KeyMap.VK_LEFT) {
            if (selectedIndex > 0 && selectedIndex <= 3) {
                this.setAttribute(selectedIndex - 1);
            }
        }
        else if (keyCode === KeyMap.VK_DOWN) {
            this.resetFocus();
            this.bookMarkAndExitView[0].classList.add("active");
        }
        else if (keyCode === KeyMap.VK_UP) {
            this.setAttribute(selectedIndex)
        }
    }
    /**
    * Description: set active Item 
    * @param {null} 
    * @return {null}
    */
    setAttribute(index) {
        this.resetFocus();
        let nxtElement = this.playerControl[index];
        nxtElement.classList.add("active");
        this.selectedControl = nxtElement.dataset.id;
    }

    /**
    * Tells Bookmark and exit option is active or not
    * @param {null} 
    * @return {boolean}
    */
    isBookMarkAndExitFocus() {
        return this.bookMarkAndExitView[0].classList.contains("active");
    }
    /**
        * Description: This Could handle Player control Key Event
        * @param {object}  Event 
        * @return {null}
        */
    handleKeyPress(event) {
        var keyCode = event.keyCode;
        switch (keyCode) {
            case KeyMap.VK_ENTER:
                if (this.isBookMarkAndExitFocus()) {
                    this.onSelectBookmarkAndExit();
                }
                else if ((this.selectedControl === PlayerControls.PLAY || this.selectedControl === PlayerControls.PAUSE)) {
                    this.playPause();
                }
                else if (this.selectedControl === PlayerControls.FORWARD) {
                    this.forward();
                }
                else if (this.selectedControl === PlayerControls.REWIND) {
                    this.backward();
                }
                else if (this.selectedControl === PlayerControls.LANGUAGE) {
                    this.onSelectLanguageMenu();
                }
                break;
            case KeyMap.VK_RIGHT:
                this.selectItem(KeyMap.VK_RIGHT);
                break;
            case KeyMap.VK_LEFT:
                this.selectItem(KeyMap.VK_LEFT);
                break;
            case KeyMap.VK_UP:
                this.selectItem(KeyMap.VK_UP);
                break;
            case KeyMap.VK_DOWN:
                this.selectItem(KeyMap.VK_DOWN);
                break;
            case KeyMap.VK_PAUSE:
            case KeyMap.VK_PLAY:
                this.playPause();
                break;
            case KeyMap.VK_FAST_FWD:
                this.forward();
                break;
            case KeyMap.VK_REWIND:
                this.backward();
                break;
            default:
                break;
        }
    }

    render() {
        return (
            <div className="player-details">
                <h3>{this.movieTitle}</h3>
                <div className="player-icon" id="playerCtrl">
                    <div id="rewind" data-id={PlayerControls.REWIND} onClick={this.backward} className="RW"></div>
                    <div id="playpause" data-id={PlayerControls.PLAY} onClick={this.playPause} className="play"> </div>
                    <div id="forward" data-id={PlayerControls.FORWARD} onClick={this.forward} className="FF"> </div>
                    <div id="language" data-id={PlayerControls.LANGUAGE} className="language"> </div>
                </div>
                <div className="text-center">
                    <a href="#" className="btn-exit"><Trans i18nKey="exit_and_bookmark"></Trans></a>
                </div>
            </div>
        )
    }
}
export default PlayerControl;