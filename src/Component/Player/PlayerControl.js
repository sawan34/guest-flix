/**
 * Summary: Player control Component
 * Description: Control playback as play ,pause ,Rewind,Forword,Languag and Exit and Bookmark
 * @author Akash Kumar Sharma
 * @date  02.08.2018
 */
import React from 'react';
import { Trans } from 'react-i18next';
import TvComponent from '../TvComponent'
import KeyMap from '../../constants/keymap.constant';
import COMMON_UTILITIES from '../../commonUtilities';
/**
 * description : Player control names initialization
 */
const PlayerControls = {
    "REWIND": "REWIND",
    "PLAY_PAUSE": "PLAY_PAUSE",
    "FORWARD": "FORWARD",
    "LANGUAGE": "LANGUAGE",
    "BOOKMARK_EXIT": "BOOKMARK_EXIT"
}
/**
 *  description : Player control css classes uses
 */
const PlayerControlClass = ["RW", "play", "FF", "language", "btn-exit"]

class PlayerControl extends TvComponent {

    constructor(props) {
        super(props);
        this.state = {
            activeIndex: 1,
            addClass: " active"
        }
    }

    /**
     * description :call on selected control event 
     * @param {String} controlName  which control trigger on selected event
     */
    onSelectedPlayerControl(controlName) {
        this.props.onSelectedPlayerControl(controlName);
    }

    /**
     *  description:on Select the Language option
     */
    onselectedLangugeCallBack() {
        this.setState({ addClass: " open-menu" })
    }
    /**
     *  description: Trigger when close the Language menu
     */
    onCloseLanguageCallback() {
        this.setState({ addClass: " active" })
    }

    /**
     *  description : playback is on play state
     */
    onPlayCallback() {
        PlayerControlClass[0] = "RW";
        PlayerControlClass[1] = "pause";
        PlayerControlClass[2] = "FF";
        this.setState({ addClass: " active", activeIndex: 1 })
    }
    /**
    *  description : playback is on pause state
    */
    onPauseCallback() {
        PlayerControlClass[0] = "RW";
        PlayerControlClass[1] = "play";
        PlayerControlClass[2] = "FF";
        this.setState({ addClass: " active", activeIndex: 1 })
    }

    /**
     * description : trigger when playback is going to backward state
     * @param {int} speedstate speed of backward state as 1X/2X/3X
     */
    onRewindCallback(speedstate) {
        PlayerControlClass[0] = "RW-" + speedstate
        PlayerControlClass[1] = "play"
        PlayerControlClass[2] = "FF"
        this.setState({ addClass: " active", activeIndex: 0 })
    }
    /**
    * description : trigger when playback is going to forward state
    * @param {int} speedstate speed of backward state as 1X/2X/3X
    */
    onForwardCallback(speedstate) {
        PlayerControlClass[0] = "RW"
        PlayerControlClass[1] = "play"
        PlayerControlClass[2] = "FF-" + speedstate;
        this.setState({ addClass: " active", activeIndex: 2 })
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
                this.onSelectedPlayerControl(Object.keys(PlayerControls)[this.state.activeIndex]);
                break;
            case KeyMap.VK_RIGHT:
                if ((this.state.activeIndex === PlayerControlClass.length - 2) || (PlayerControls.BOOKMARK_EXIT === Object.keys(PlayerControls)[this.state.activeIndex])) {
                    return
                }
                this.setState({ activeIndex: this.state.activeIndex + 1 })
                break;
            case KeyMap.VK_LEFT:
                if (this.state.activeIndex === 0 || (PlayerControls.BOOKMARK_EXIT === Object.keys(PlayerControls)[this.state.activeIndex])) {
                    return
                }
                this.setState({ activeIndex: this.state.activeIndex - 1 })
                break;
            case KeyMap.VK_UP:
                this.setState({ activeIndex: 0 })
                break;
            case KeyMap.VK_DOWN:
                this.setState({ activeIndex: 4 })
                break;
            default:
                break;
        }
    }

    /**
     * Description : Render the four player controls Rewind,Play/Pause,Forward and Language
     */
    renderPlaybackView = () => {
        return (
            PlayerControlClass.map((item, i) => {
                if (i < 4)
                    return (<div id={item} key={item} data-id={PlayerControls.REWIND} onClick={this.backward} className={(i === this.state.activeIndex) ? (item + this.state.addClass) : item}></div>)
            }))
    }
    /**
     * Description : Render the single player controls Exit and bookmark
     */
    renderExitAndBookMarkView() {
           const result =  PlayerControlClass.map((item, i) => {
                if (i === 4)
                    return (<a id={item} key={item} className={(this.state.activeIndex === 4) ? (item + this.state.addClass) : item}><Trans i18nKey="exit_and_bookmark"></Trans></a>)
            });
            return result.filter(item=>!COMMON_UTILITIES.isEmpty(item));
        }

    /**
     * Description : Rendering the Html 
     * @Override function of Component class
     */
    render() {
        return (
            <div className="player-details">
                <h3>{this.props.title}</h3>
                <div className="player-icon" id="playerCtrl">
                    {this.renderPlaybackView() }
                    
                </div>
                <div className="text-center">
                    {this.renderExitAndBookMarkView()}
                </div>
            </div>
        )
    }
}
export default PlayerControl;
