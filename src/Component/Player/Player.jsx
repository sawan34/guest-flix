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
import PlayerControl from './PlayerControl'
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
        this.HIDE_BAR = 10000;
        this.scopeTimer = null;
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
        this.onSelectBookmarkAndExit = this.onSelectBookmarkAndExit.bind(this);
        this.onSelectLanguageMenu = this.onSelectLanguageMenu.bind(this);
        this.initialisePlayer = this.initialisePlayer.bind(this);

        this.playerControl = [];
        this.elementPlayPause = null;
        this.elementForward = null;
        this.elementRewind = null;
        this.elementLanguage = null;
        this.pluginPlayer = null;
        this.timeView = null;
        this.progressBarFillId = null;
        this.playerMessageView = null;
        this.selectedControl = null;
        this.progressContainer = null;
        this.bookMarkAndExitView = null;
        this.state = {
            init: true,
            isLanguageMenuOpen: false,
        }
    }

    /**
     * @override function of BaseScreen
     * initialize the bookmark ,behalf of programId
     */
    componentWillMount() {
        super.componentWillMount();
        Utility.refreshBookmarks();
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
        const playerParams = this.getPlayerParams();
        this.playerControlComponent.focus();
        this.initialisePlayer(playerParams);
        this.selectedControl = PlayerControls.PLAY;
        this.elementPlayPause.className = "play active";
    }

    /**
     * Hide the PlayerControl and Seek baar 
     */
    hideBarTimer() {
        clearTimeout(this.scopeTimer);
        this.scopeTimer = setTimeout(function () {
            this.progressContainer.style.display = "none";
        }, this.HIDE_BAR);
    };

    /**
     * Show the PlayerControl and Seek baar 
     */
    showPlayerController() {
        this.progressContainer.style.display = "block";
    }

    getPlayerParams() {
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
        return playerParams;
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
        this.elementLanguage = document.getElementById("language");
        this.pluginPlayer = document.getElementById("pluginPlayer");
        this.timeView = document.getElementById("timeView");
        this.progressBarFillId = document.getElementById("progressBarFillId");
        this.playerMessageView = document.getElementById("playerMessageView");
        this.progressContainer = document.getElementById("progressContainer");
        this.bookMarkAndExitView = document.getElementsByClassName("btn-exit");
    }

    /**
    * Description: create player instance and set default props
    * @param {playerParams} Object
    * @return {null}
    */
    initialisePlayer(playerParams) {
        this.hideBarTimer()
        this.objPlayerService = new PlayerService(playerParams);
        this.objPlayerService.init(this._onFinish, this._hidePlayerControlBar);
        if (!Utility.isEmpty(this.objBookMark)) {
            this.objPlayerService.setSeekTime(this.objBookMark.positionInMs);
            this.objPlayerService.setVideoURL(this.objBookMark.playbackMeta.url);
            this.playAndResumeVideo();
        }
    }
    //============================End-----Player initialization phase===================// 

    //============================Start-----Callback functions===================//
    /**
    * Description: callback after pause button pressed
    * @param {null} 
    * @return {null}
    */
    onpauseFinish() {
        this.playerControlComponent.resetFocus();
        this.elementPlayPause.className = "play active";
    }

    /**
    * Description: callback after play button pressed
    * @param {null} 
    * @return {null}
    */
    onplayFinish() {
        this.playerControlComponent.resetFocus();
        this.elementPlayPause.className = "pause active";
        this.selectedControl = PlayerControls.PLAY;
    }

    /**
    * Description: callback after forward button pressed
    * @param {speedstate} number 
    * @return {null}
    */
    onforwardFinish(speedstate) {
        this.playerControlComponent.resetFocus();
        this.elementPlayPause.className = "play";
        this.elementForward.className = "FF-" + speedstate + " active";
    }

    /**
    * Description: callback after rewind button pressed
    * @param {speedstate} number 
    * @return {null}
    */
    onrewindFinish(speedstate) {
        this.playerControlComponent.resetFocus();
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
        this.selectedControl = PlayerControls.PLAY;
        if (!this.state.isLanguageMenuOpen) {
            this.playerControlComponent.resetFocus();
            this.elementPlayPause.className = "play active";
        }
        console.log("OnFinish")
        clearTimeout(this.scopeTimer);
        this.objPlayerService.deinit();
        this.handleBack();
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
        this.setState({ init: true });
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
    }
    /**
    * Open the Audio and Subtitle Menu
    */
    onSelectLanguageMenu() {
        if (!this.state.isLanguageMenuOpen) {
            this.setState({ isLanguageMenuOpen: true });
            this.playerControlComponent.deFocus();
            let nxtElement = this.playerControl[3];
            nxtElement.classList.remove("active");
            nxtElement.classList.add("open-menu");
        } else {
            this.setState({ isLanguageMenuOpen: false });
        }
    }
    /**
     * Close the Audio and Subtitle Menu
     */
    closeLangMenu = () => {
        this.setState({ isLanguageMenuOpen: false });
        this.playerControlComponent.focus();
        let nxtElement = this.playerControl[3];
        nxtElement.classList.remove("open-menu");
        nxtElement.classList.add("active");
        this.langMenuComponent.deFocus();
    }
    /**
     *  On Exit and Bookmark the playback save the position in Ms.
     *  Get order Id behalf of Program ID  
     */
    onSelectBookmarkAndExit() {
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

    /**
    * Description: This Could handle sreens Key Event
    * @param {object}  Event 
    * @return {null}
    */
    handleKey(event) {
        var keyCode = event.keyCode;
        this.showPlayerController();
        if ((this.objPlayerService.isFowrdingOrRewinding() == false)) {
            this.hideBarTimer();
        }
        switch (keyCode) {
            case KeyMap.VK_BACK:
                clearTimeout(this.scopeTimer);
                this.handleBack();
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

                        <PlayerControl
                            title={this.props.programDetailsReducer.data.title}
                            playPause={this.playPause}
                            forward={this.forward}
                            backward={this.backward}
                            onSelectLanguageMenu={this.onSelectLanguageMenu}
                            onSelectBookmarkAndExit={this.onSelectBookmarkAndExit}
                            onRef={instance => (this.playerControlComponent = instance)}
                        />

                        {
                            this.state.isLanguageMenuOpen ? <LangMenuGridView onRef={instance => (this.langMenuComponent = instance)} onCloseLangMenu={this.closeLangMenu} audioLangData={this.props.programDetailsReducer.data.availableAudio} subtitleData={this.props.programDetailsReducer.data.availableSubtitles} /> : <div></div>
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
