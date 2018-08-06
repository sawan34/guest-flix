/**
 * Summary: Player Component
 * Description: Player component (View only which consumes playerservice to implement player's actions) 
 * @author Vikash Kumar
 * @date  03.07.2018
 */

import React from "react";
import BaseScreen, { invokeConnect } from "../../Containers/Screens/BaseScreen";
import KeyMap from '../../constants/keymap.constant';
import LangMenuGridView from '../LangMenu/LangMenuGridView';
import RoomUserService from '../../services/service.roomUser'
import Utility from '../../commonUtilities'
import { actionPlaybackBookmark } from "../../actions/action.bookmark"
import { PlayerService } from './player.service';
import { alertConstants } from '../../constants/alert.constant';
import { validCodes } from '../../constants/error.constant'
import { Trans } from 'react-i18next';
import _ from 'lodash';
require('font-awesome/css/font-awesome.min.css');

const PlayerControls = {
    "PLAY": "PLAY",
    "PAUSE": "PAUSE",
    "FORWARD": "FORWARD",
    "REWIND": "REWIND",
    "LANGUAGE": "LANGUAGE"
}

class Player extends BaseScreen {
    /**
    * Description: class initialization, event binding, set initial state 
    * @param {null} 
    * @return {null}
    */
    constructor(props) {
        super(props);

        this.objPlayerService = {};
        this.objBookMark = {};
        this._hidePlayerControlBar = this._hidePlayerControlBar.bind(this);
        this._onFinish = this._onFinish.bind(this);
        this.playPause = this.playPause.bind(this);
        this.forward = this.forward.bind(this);
        this.backward = this.backward.bind(this);
        this.onplayFinish = this.onplayFinish.bind(this);
        this.onpauseFinish = this.onpauseFinish.bind(this);
        this.onforwardFinish = this.onforwardFinish.bind(this);
        this.onrewindFinish = this.onrewindFinish.bind(this);
        this.initialisePlayer = this.initialisePlayer.bind(this);

        this.playerControl = [];
        this.elementPlayPause = null;
        this.elementForward = null;
        this.elementRewind = null;
        this.pluginPlayer = null;
        this.timeView = null;
        this.progressBarFillId = null;
        this.playerMessageView = null;
        this.selectedControl = null;
        this.bookMarkAndExitView = null;
        this.state = {
            init: true,
            isLanguageMenuOpen: false
        }
    }

    /**
     * @override function of BaseScreen
     * initialize the bookmark ,behalf of programId
     */
    componentWillMount() {
        super.componentWillMount();
        this.objBookMark = Utility.getBookmarksObjByProgramId(_.toNumber(this.props.routerData.match.params.id));
    }
    //============================Start-----Player initialization phase===================// 
    /**
   * Description: prepare default props for player and pass to 
   * @param {null} 
   * @return {null}
   */
    componentDidMount() {
        this.getDomElements();
        this.playerControl = _.map(this.playerControl);

        let playerParams = {};
        playerParams["plugin"] = this.pluginPlayer;
        playerParams["timeView"] = this.timeView;
        playerParams["progressView"] = this.progressBarFillId;
        playerParams["messageView"] = this.playerMessageView;
        playerParams["onpauseFinish"] = this.onpauseFinish;
        playerParams["onplayFinish"] = this.onplayFinish;
        playerParams["onforwardFinish"] = this.onforwardFinish;
        playerParams["onrewindFinish"] = this.onrewindFinish;
        playerParams["playerSpeedLimit"] = 3;
        this.initialisePlayer(playerParams);
        this.selectedControl = PlayerControls.PLAY;
        this.elementPlayPause.className = "play active";
        Utility.refreshBookmarks();
    }

    /**
    * Description: fetch player control's dom elements
    * @param {null}  
    * @return {null}
    */
    getDomElements() {
        this.playerControl = document.getElementById('playerCtrl').childNodes;
        this.elementPlayPause = document.getElementById("playpause");
        this.elementForward = document.getElementById("forward");
        this.elementRewind = document.getElementById("rewind");
        this.pluginPlayer = document.getElementById("pluginPlayer");
        this.timeView = document.getElementById("timeView");
        this.progressBarFillId = document.getElementById("progressBarFillId");
        this.playerMessageView = document.getElementById("playerMessageView");
        this.bookMarkAndExitView = document.getElementsByClassName("btn-exit");
    }

    /**
    * Description: create player instance and set default props
    * @param {playerParams} Object
    * @return {null}
    */
   initialisePlayer(playerParams) {
    this.objPlayerService = new PlayerService(playerParams);
    this.objPlayerService.init(this._onFinish, this._hidePlayerControlBar);
    if (!Utility.isEmpty(this.objBookMark)) {
        this.objPlayerService.setSeekTime(this.objBookMark.positionInMs);
        this.objPlayerService.setVideoURL(this.objBookMark.playbackMeta.url);
        this.playAndResumeVideo();
    }
}
    //============================End-----Player initialization phase===================// 

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

    setAttribute(index) {
        this.resetFocus();
        let nxtElement = this.playerControl[index];
        nxtElement.classList.add("active");
        this.selectedControl = nxtElement.dataset.id;
    }

    isBookMarkAndExitFocus() {
        return this.bookMarkAndExitView[0].classList.contains("active");
    }


    //============================Start-----Callback functions===================//
    /**
    * Description: callback after pause button pressed
    * @param {null} 
    * @return {null}
    */
    onpauseFinish() {
        this.resetFocus();
        this.elementPlayPause.className = "play active";
    }

    /**
    * Description: callback after play button pressed
    * @param {null} 
    * @return {null}
    */
    onplayFinish() {
        this.resetFocus();
        this.elementPlayPause.className = "pause active";
        this.selectedControl = PlayerControls.PLAY;
    }

    /**
    * Description: callback after forward button pressed
    * @param {speedstate} number 
    * @return {null}
    */
    onforwardFinish(speedstate) {
        this.resetFocus();
        this.elementPlayPause.className = "play";
        this.elementForward.className = "FF-" + speedstate + " active";
    }

    /**
    * Description: callback after rewind button pressed
    * @param {speedstate} number 
    * @return {null}
    */
    onrewindFinish(speedstate) {
        this.resetFocus();
        this.elementPlayPause.className = "play";
        this.elementRewind.className = "RW-" + speedstate + " active";
    }

    /**
    * Description: callback for onfinish of video play
    * @param {null} 
    * @return {null}
    */
    _onFinish() {
        this.setState({ init: true });
        this.elementPlayPause.className = "play";
        this.resetFocus();
        this.elementPlayPause.className = "play active";
        this.selectedControl = PlayerControls.PLAY;
    }
    //============================End-----Callback functions===================//

    _hidePlayerControlBar() {

    }

    //============================Start-----Player Events===================//

    /**
    * Description: fire Play event for video player
    * @param {null} 
    * @return {null}
    */
    playPause() {
        this.objPlayerService.playVideo();
    }
    /**
    * Description: fire forward event for video player
    * @param {null} 
    * @return {null}
    */
    forward() {
        this.objPlayerService.forward();
    }
    /**
   * Description: fire rewind event for video player
   * @param {null} 
   * @return {null}
   */
    backward() {
        this.objPlayerService.rewind();
    }

    /**
     * Play and resume Video while seekTime is greater than 0
     */
    playAndResumeVideo() {
        this.objPlayerService.playVideo();
        this.objPlayerService.resumeVideo();
    }
    /**
    * Open the Audio and Subtitle Menu
    */
    openLanguageMenu() {
        if (!this.state.isLanguageMenuOpen) {
            this.setState({ isLanguageMenuOpen: true });
            let nxtElement = this.playerControl[3];
            nxtElement.classList.replace("active", "open-menu");
        } else {
            this.setState({ isLanguageMenuOpen: false });
        }
    }
    /**
     * Close the Audio and Subtitle Menu
     */
    closeLangMenu = () => {
        this.setState({ isLanguageMenuOpen: false });
        let nxtElement = this.playerControl[3];
        nxtElement.classList.replace("open-menu", "active");
    }
    /**
     *  On Exit and Bookmark the playback save the position in Ms.
     *  Get order Id behalf of Program ID  
     */
    updatePlaybackPosition() {
        const playbackPositionMs = Utility.getMilliSeconds(Math.round(this.objPlayerService.plugin.currentTime));
        const programId = _.toNumber(this.props.routerData.match.params.id);
        const stayId = RoomUserService.getStayId();
        const orderId = Utility.getBookmarksOrderIdByProgramId(programId);
        if (!Utility.isEmpty(orderId)) {
            this.props.bookmarkPositionAction(orderId, programId, stayId, playbackPositionMs);
            if (this.props.bookmarkReducer.type === alertConstants.SUCCESS && validCodes(this.props.bookmarkReducer.message.status)) {
                let homePosition = window.routerHistory.indexOf("home") + 1;
                this.props.routerData.history.go(-homePosition);
            }
        }
    }

    //============================End-----Player Events===================//

    /**
    * Description: This Could handle Key Event Handle Key 
    * @param {object}  Event 
    * @return {null}
    */
    handleKey(event) {
        if (this.state.isLanguageMenuOpen) {
            return;
        }
        var keyCode = event.keyCode;
        switch (keyCode) {
            case KeyMap.VK_BACK:
                this.handleBack();
                break;
            case KeyMap.VK_ENTER:
                if (this.isBookMarkAndExitFocus()) {
                    this.updatePlaybackPosition();
                } else if ((this.selectedControl === PlayerControls.PLAY || this.selectedControl === PlayerControls.PAUSE)) {
                    this.playPause();
                }
                else if (this.selectedControl === PlayerControls.FORWARD) {
                    this.forward();
                }
                else if (this.selectedControl === PlayerControls.REWIND) {
                    this.backward();
                }
                else if (this.selectedControl === PlayerControls.LANGUAGE) {
                    this.openLanguageMenu();
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
            default:
                break;
        }
    }

    render() {
        return (
            <div className="container" id="playerContainer">

                <div className="player-wrapper">
                    <video id="pluginPlayer" className='videoPlayer' width="100%" src="" poster="../images/player-poster.jpg">
                    </video>
                    <div id="progressContainer" className='progressContainer'>

                        <div className="player-details">
                            <h3>{this.props.programDetailsReducer.data.title}</h3>
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
                        {
                            this.state.isLanguageMenuOpen ? <LangMenuGridView onCloseLangMenu={this.closeLangMenu} audioLangData={this.props.programDetailsReducer.data.availableAudio} subtitleData={this.props.programDetailsReducer.data.availableSubtitles} /> : <div></div>
                        }
                        <div className="progressbar-wrapper">
                            <div id='currentTimeDiv'><span id='timeView'></span></div>
                            <div className='progressBarJSContainer' >
                                <div id='progressBarPanasonic' className='progressBarJS'>
                                    <div id="progressBarFillId" className='progressBarFillJS'><div className="progressbar-circle"></div></div>
                                </div>
                            </div>

                        </div>

                    </div>
                </div>

                <div id="playerMessageView">
                    {this.props.message}
                </div>
            </div>
        )
    }
}

export default invokeConnect(Player, null, '', {
    bookmarkPositionAction: actionPlaybackBookmark
}, {
        bookmarkReducer: 'reducerBookmarkPlayBack',
        programDetailsReducer: 'getProgramDetails',
    });
