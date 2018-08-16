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
import _ from 'lodash';
require('font-awesome/css/font-awesome.min.css');

const PlayerControls = {
    "REWIND": "REWIND",
    "PLAY_PAUSE": "PLAY_PAUSE",
    "FORWARD": "FORWARD",
    "LANGUAGE": "LANGUAGE",
    "BookmarkExit": "BookmarkExit"
}

class Player extends BaseScreen {
    /**
    * Description: class initialization, event binding, set initial state 
    * @param {null} 
    * @return {null}
    */
    constructor(props) {
        super(props);
        this.HIDE_CONTROL_TIMEOUT = 10000;
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
        this.progressContainer = null;
        this.bookMarkAndExitView = null;
        this.isBack = true;
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
    }

    /**
     * Hide the PlayerControl and Seek baar 
     */
    hideBarTimer() {
        clearTimeout(this.scopeTimer);
        this.scopeTimer = setTimeout(function () {
            this.progressContainer.style.display = "none";
        }, this.HIDE_CONTROL_TIMEOUT);
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
        this.pluginPlayer = document.getElementById("pluginPlayer");
        this.timeView = document.getElementById("timeView");
        this.progressBarFillId = document.getElementById("progressBarFillId");
        this.playerMessageView = document.getElementById("playerMessageView");
        this.progressContainer = document.getElementById("progressContainer");
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
        this.playerControlComponent.onPauseCallback();
    }

    /**
    * Description: callback after play button pressed
    * @param {null} 
    * @return {null}
    */
    onplayFinish() {
        this.playerControlComponent.onPlayCallback();
    }

    /**
    * Description: callback after forward button pressed
    * @param {speedstate} number 
    * @return {null}
    */
    onforwardFinish(speedstate) {
        this.playerControlComponent.onForwardCallback(speedstate);
    }

    /**
    * Description: callback after rewind button pressed
    * @param {speedstate} number 
    * @return {null}
    */
    onrewindFinish(speedstate) {
        this.playerControlComponent.onRewindCallback(speedstate);
    }

    /**
    * Description: callback for onfinish of video play
    * @param {null} 
    * @return {null}
    */
    _onFinish() {
        this.setState({ init: true });
        clearTimeout(this.scopeTimer);
        this.objPlayerService.deinit();
        if (this.isBack) {
            this.handleBack();
        }
        this.isBack = false;
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
            this.playerControlComponent.onselectedLangugeCallBack()
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
        this.playerControlComponent.onCloseLanguageCallback()
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
     * Description : calling by the props from Player conrol component
     * Occur the operation of corresponding event
     *  @param {String} selected control name
     */
    onSelectedPlayerControl = (controlerName) => {
        switch (controlerName) {
            case PlayerControls.PLAY_PAUSE:
                this.playPause();
                break;
            case PlayerControls.REWIND:
                this.backward();
                break;
            case PlayerControls.FORWARD:
                this.forward();
                break;
            case PlayerControls.LANGUAGE:
                this.onSelectLanguageMenu();
                break;
            case PlayerControls.BookmarkExit:
                this.onSelectBookmarkAndExit();
                break;
            default:
                break;
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
            case KeyMap.VK_PAUSE:
            case KeyMap.VK_PLAY:
                this.onSelectedPlayerControl(PlayerControls.PLAY_PAUSE);
                break;
            case KeyMap.VK_FAST_FWD:
                this.onSelectedPlayerControl(PlayerControls.FORWARD);
                break;
            case KeyMap.VK_REWIND:
                this.onSelectedPlayerControl(PlayerControls.REWIND);
                break;
            case KeyMap.VK_STOP:
                this.onSelectedPlayerControl(PlayerControls.BOOKMARK_EXIT);
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
                            onSelectedPlayerControl={this.onSelectedPlayerControl}
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
                    {this.props.message?this.props.message:null}
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
