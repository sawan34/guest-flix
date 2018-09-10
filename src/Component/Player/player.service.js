/**
 * Summary: PlayerService
 * Description: This service file contains the methods/functions to implement the player's functionality 
 * @author Vikash Kumar
 * @date  03.07.2018
 */
import i18next from 'i18next';
export class PlayerService {
    /**
    * Description: class initialization, set initial properties while instanciating
    * @param {null} 
    * @return {null}
    */
    constructor(props) {
        this.Player = {};
        this.Player["TAG"] = "PlayerServcie";
        this.state = -1;
        this.playerState = -1;
        this.stopCallback = null;    /* Callback function to be set by client */
        this.originalSource = null;
        this.STOPPED = 0;
        this.PLAYING = 1;
        this.PAUSED = 2;
        this.FORWARD = 3;
        this.REWIND = 4;
        this.Error = -1;
        this.SEEK_INTERVAL = 10;
        this.duration = 0;
        this.speedForwardRewind = 0;

        this.plugin = props.plugin;
        this.timeView = props.timeView;
        this.progressView = props.progressView;
        this.messageView = props.messageView;
        this.onplayFinish = props.onplayFinish;
        this.onpauseFinish = props.onpauseFinish;
        this.onforwardFinish = props.onforwardFinish;
        this.onrewindFinish = props.onrewindFinish;
        this.playerSpeedLimit = props.playerSpeedLimit;

        this.timeoutFastForwardRewind = null;
        this.timerForwardRewind = null;
        this.timerManualUpdate = null;
        this.stepForwardRewind = 5;
        this.seekTime = 0;
        this.stateForwardOrRewind = -1;  //Internal state, ideally 'state' can be reused but we need to show video paused, so internal state for FF and RR
        this.hidePlayerControlBarOnCompletion = null;
        this.isBuffering = false;    //isBuffering
        this.isDeinitCall = false;
        this.onFinish = null;
        this.url = null;
        this.speedState = 1;
        this.source = this.plugin.childNodes[0];
    }

    /**
   * Description: default logger for this class
   * @param {tag, message} String 
   * @return {null}
   */
    log(tag, message) {

    }

    /**
   * Description: Player instance initialization,clear intervals if exists already, register event listners
   * @param {_onFinish, _hidePlayerControlBar} function
   * @return {success} boolean
   */
    init = function (_onFinish, _hidePlayerControlBar) {
        var success = true;
        this.onFinish = _onFinish;
        this.isDeinitCall = false;
        this.hidePlayerControlBarOnCompletion = _hidePlayerControlBar;
        this.speedForwardRewind = this.stepForwardRewind;
        clearInterval(this.timerForwardRewind);
        clearInterval(this.timerManualUpdate);

        if (!this.plugin) {
            success = false;
        };
        this.pauseAfterFFRR = false;
        this.registerListeners();

        return success;
    }

    /**
   * Description: destroy player instance if exists already, clear intervals
   * @param {null} 
   * @return {null}
   */
    deinit = function () {
        clearInterval(this.timerForwardRewind);
        clearInterval(this.timerManualUpdate);
        this.pauseAfterFFRR = false;
        this.isDeinitCall = true;
        if (this.plugin) {
            this.plugin.pause();
            this.plugin.innerHTML = "";
            this.plugin.remove();
            delete this.plugin;
        }
        this.pauseAfterFFRR = false;
        this.state = -1;
        this.playerState = -1;
        this.isBuffering = false;
        this.seekTime = 0;
        this.plugin = null;
    }

    /**
   * Description: set window of the player
   * @param {null} 
   * @return {null}
   */
    setWindow = function () {
        //this.plugin.SetDisplayArea(285,210,620,265);
    }

    /**
   * Description: set display area of the player
   * @param {null} 
   * @return {null}
   */
    setWindowMiniDtv = function () {
        //this.plugin.SetDisplayArea(285,210,620,265);

    }

    /**
   * Description: set full screen area of the player
   * @param {null} 
   * @return {null}
   */
    setFullscreen = function () {
        //Set full screen
        //this.plugin.SetDisplayArea(0, 0, 960, 540);
    }

    /**
  * Description: set actual player area on the viewport
  * @param {null} 
  * @return {null}
  */
    setPlayerArea = function (x, y, width, height) {

    }

    /**
   * Description: set url of the video
   * @param {url} string
   * @return {null}
   */
    setVideoURL = function (url) {
        this.url = url;

    }


    /**
    * Description: set seek Time in sec for resume playback
    * @param {url} int
    * @return {null}
    */
    setSeekTime = function (seekPosition) {
        this.seekTime = seekPosition / 1000;
    }



    /**
   * Description: set url to the player source, pause check and resume checks
   * @param {null} 
   * @return {null}
   */
    playVideo = function () {
        if (this.isBuffering) {
            // Buffering is in process, ignoring play request.
        }
        else {
            if (this.state === -1) {
                this.plugin.setAttribute('autoplay', true);
                this.source.setAttribute('src', this.url);
            } else if (!this.plugin.paused) {
                this.pauseVideo();
            }
            else if (this.plugin.paused) {
                if (this.state === this.FORWARD || this.state === this.REWIND) {
                    this.resumeVideo();
                } else {
                    this.playStream();
                }
            }
        }
    }

    /**
  * Description: play stream
  * @param {null} 
  * @return {null}
  */
    playStream() {
        this.plugin.play();
        this.onplayFinish();
    }

    /**
    * Description: pause video
    * @param {null} 
    * @return {null}
    */
    pauseVideo = function () {
        if (this.state !== this.PAUSED) {
            if ((this.stateForwardOrRewind === this.FORWARD) || (this.stateForwardOrRewind === this.REWIND)) {
                clearInterval(this.timerForwardRewind);
                this.stateForwardOrRewind = -1;
                this.pauseAfterFFRR = true;
                this.state = this.PAUSED;
            } else {
                this.pauseAfterFFRR = false;
                this.state = this.PAUSED;
                this.plugin.pause();
            }
            this.onpauseFinish();
        }
        else {
            //Video already paused ,ignore attempt
        }
    }

    /**
  * Description: stop video
  * @param {null} 
  * @return {null}
  */
    stopVideo = function () {
        if (this.state !== this.STOPPED) {
            this.onFinish();
            clearInterval(this.timerForwardRewind);
            clearInterval(this.timerManualUpdate);
            this.stateForwardOrRewind = -1;
            this.seekTime = 0;
            this.duration = 0;
        }
    }

    /**
  * Description: resume video
  * @param {null} 
  * @return {null}
  */
    resumeVideo = function () {
        if ((this.stateForwardOrRewind === this.FORWARD) || (this.stateForwardOrRewind === this.REWIND) || (this.pauseAfterFFRR === true) || this.seekTime !== 0) {
            // Resume video... clear timer
            clearInterval(this.timerForwardRewind);
            this.manualProgressUpdate();
            this.stateForwardOrRewind = -1;
            this.plugin.currentTime = this.seekTime;
            this.seekTime = 0;
            this.pauseAfterFFRR = false;
        }
        this.playStream();
    }

    /**
      * Description: timer for rewind and forward
      * @param {null} 
      * @return {null}
      */
    onTickTimerForwardRewind = function () {
        if (this.stateForwardOrRewind === this.FORWARD) {
            if (this.seekTime + this.stepForwardRewind > this.duration) {
                this.plugin.currentTime = this.duration;
                clearInterval(this.timerForwardRewind); //Clear timer
                this.seekTime = 0;
                this.stateForwardOrRewind = -1;
                this.hidePlayerControlBarOnCompletion();
                this.stopVideo();
            } else {
                this.seekTime += this.stepForwardRewind;
                this.updateSeekBarOnly();
            }

        } else if (this.stateForwardOrRewind === this.REWIND) {
            if (this.seekTime - this.stepForwardRewind <= 0) {
                clearInterval(this.timerForwardRewind); //Clear timer
                this.state = this.PLAYING;
                this.stateForwardOrRewind = -1;
                this.seekTime = 0;
                //this.hidePlayerControlBarOnCompletion();
                this.manualProgressUpdate();
                this.plugin.currentTime = 0;
                this.plugin.play();
            } else {
                this.seekTime -= this.stepForwardRewind;
                this.updateSeekBarOnly();
            }
        } else {
            clearInterval(this.timerForwardRewind);
        }
    }

    /**
  * Description: reset stream speed
  * @param {null} 
  * @return {null}
  */
    resetStreamSpeed = function (currentState) {
        if ((this.state !== currentState)) {
            this.speedState = 1;
        }
        if (currentState === this.FORWARD || currentState === this.REWIND) {
            if (this.stepForwardRewind <= this.speedForwardRewind * 3) {
                this.stepForwardRewind = this.speedForwardRewind * this.speedState;
            }
            this.speedState++;
        }
    }

    /**
      * Description: forward video
      * @param {null} 
      * @return {null}
      */
    forward = function () {
        this.resetStreamSpeed(this.FORWARD);
        this.showMessage('');
        if (this.isBuffering === true) {
            //Buffering is in process, ignoring rewind request.
            return;
        }
        if (this.stateForwardOrRewind !== this.FORWARD) {
            this.state = this.FORWARD;
            //Switch between Rewind to Forward
            if (this.stateForwardOrRewind === this.REWIND) {
                //Clear the timer, dont change seek time
                //Switching from Rewind to Forward.
                clearInterval(this.timerForwardRewind);
            } else {
                if (this.pauseAfterFFRR === true) {
                    this.pauseAfterFFRR = false; //If player was paused after FF or RR, dont initilize seekTime variable...
                    // Started FORWARD operation from pauseAfterFFRR state
                } else {
                    this.seekTime = this.plugin.currentTime;
                }
            }
            this.stateForwardOrRewind = this.FORWARD; // This will be used in onTick function, one possible solution is to pass a flag (FF or RR) in timer function ..... For now keeping state based
            this.plugin.pause();
            clearInterval(this.timerManualUpdate);
            // Activating timer for fast forward. starting sek time
            this.timerForwardRewind = setInterval(this.onTickTimerForwardRewind.bind(this), 500);
        } else {
            //Already forwarding...ignore attempt.
        }
        if (this.speedState - 1 <= this.playerSpeedLimit) {
            this.onforwardFinish(this.speedState - 1);
        }
    }

    /**
   * Description: rewind video
   * @param {null} 
   * @return {null}
   */
    rewind = function () {
        this.resetStreamSpeed(this.REWIND);
        this.showMessage('');
        if (this.isBuffering === true) {
            // Buffering is in process, ignoring rewind request.
            return;
        }
        if (this.stateForwardOrRewind !== this.REWIND) {
            this.state = this.REWIND;
            if (this.stateForwardOrRewind === this.FORWARD) {
                //Clear the timer, dont change seek time
                //Switching from Forward to Rewind.
                clearInterval(this.timerForwardRewind);
            } else {
                if (this.pauseAfterFFRR === true) {
                    this.pauseAfterFFRR = false; //If player was paused after FF or RR, dont initilize seekTime variable...
                    //Started rewind operation from pauseAfterFFRR state.
                } else {
                    this.seekTime = this.plugin.currentTime;
                }
            }
            this.stateForwardOrRewind = this.REWIND;
            this.plugin.pause();
            clearInterval(this.timerManualUpdate);
            // Activating timer for fast rewind. Starting seek time
            this.timerForwardRewind = setInterval(this.onTickTimerForwardRewind.bind(this), 500);
        } else {
            // Already rewinding...ignore attempt
        }
        if (this.speedState - 1 <= this.playerSpeedLimit) {
            this.onrewindFinish(this.speedState - 1);
        }
    }

    /**
   * Description:check if forwarding or rewinding
   * @param {null} 
   * @return {null}
   */
    isFowrdingOrRewinding = function () {
        return (this.stateForwardOrRewind !== -1);
    }

    getState = function () {
        return this.state;
    }

    /**
       * Description: on buffer start
       * @param {null} 
       * @return {null}
       */
    onBufferingStart = function () {
        this.isBuffering = true;
    }

    /**
   * Description: on buffering progress
   * @param {null} 
   * @return {null}
   */
    onBufferingProgress = function (percent) {
        this.showMessage('Buffering...');
    }
    /**
   * Description: on buffering complete
   * @param {null} 
   * @return {null}
   */
    onBufferingComplete = function () {
        this.isBuffering = false;
        this.showMessage('');
    }

    /**
   * Description: on waiting
   * @param {null} 
   * @return {null}
   */
    onWaiting = function () {
        this.showMessage('Buffering ...');
        this.onplayFinish();
    }
    /**
   * Description: on load start
   * @param {null} 
   * @return {null}
   */
    onLoadStart = () => {
        this.showMessage('Loading...');
    }
    onMetaData = function () {
        this.message = '';
        //Player.showMessage('onMeta deta');
    }
    /**
   * Description: on video buffer complete
   * @param {null} 
   * @return {null}
   */
    onComplete = function () {
        this.onFinish();
        this.onplayFinish();
    }

    /**
 * Description: on error
 * @param {null} 
 * @return {null}
 */
    onError = function () {
        this.showMessage('Error while playing.');
    }

    /**
   * Description: on time change
   * @param {null} 
   * @return {null}
   */
    onTimeChange = function () {
        var currentTime = this.plugin.currentTime;
        this.duration = this.plugin.duration;
        this.updateUITime(currentTime, this.duration);

        var percent = (100 / this.duration) * currentTime;
        this.progressView.style.width = percent + '%';
    }

    /**
   * Description: update seek bar
   * @param {null} 
   * @return {null}
   */
    updateSeekBarOnly = function () {
        var currentTime = this.seekTime;
        this.duration = this.plugin.duration;
        this.updateUITime(currentTime, this.duration);

        var percent = (100 / this.duration) * currentTime;
        this.progressView.style.width = percent + '%';
    }

    OnNetworkDisconnected = function () {
    }

    getBandwidth = function (bandwidth) { this.log(this.Player.TAG, "getBandwidth " + bandwidth); }

    onDecoderReady = function () { this.log(this.Player.TAG, "onDecoderReady"); }

    onRenderError = function () { this.log(this.Player.TAG, "onRenderError"); }


    setTottalBuffer = function (buffer) { this.log(this.Player.TAG, "setTottalBuffer " + buffer); }

    setCurBuffer = function (buffer) { this.log(this.Player.TAG, "setCurBuffer " + buffer); }

    /**
  * Description: manual update progress bar
  * @param {null} 
  * @return {null}
  */
    manualProgressUpdate = () => {
        clearInterval(this.timerManualUpdate);
        let that = this;
        this.timerManualUpdate = setInterval(function () {
            //This must be called only in case of manual update.
            if (that.plugin.currentTime && that.plugin.currentTime > 0) {
                that.showMessage('');
                if (that.isDeinitCall === true) {
                    //Something left stop here manually.
                    that.deinit();
                }
            }
            if (that.plugin.duration && that.plugin.duration > 0) {
                that.onTimeChange();
                if (that.plugin.currentTime >= that.duration) {
                    //Manually fire onComplete event if not available 
                    that.onComplete();
                }
            }
        }, 100);
    }

    /**
    * Description: register player listeners
    * @param {null} 
    * @return {null}
    */
    registerListeners = function () {
        this.manualProgressUpdate();
        this.plugin.addEventListener("loadstart", (event) => {
            this.showMessage('player_loading_message');
        });
        this.plugin.addEventListener("ended", (event) => {
            this.onFinish();
        });
        this.source.addEventListener("error", (event) => {
            this.state = this.Error;
            this.showMessage('player_error_message');
        });
        this.source.addEventListener("playing", (event) => {
            this.state = this.PLAYING;
            this.isBuffering = false;
        });
        this.plugin.addEventListener("play", (event) => {
            this.state = this.PLAYING;
            this.onplayFinish();
        });
        this.plugin.addEventListener("loadeddata", (event) => {
            this.showMessage('');
            this.isBuffering = false;
        });
        this.plugin.addEventListener("waiting", (event) => {
            this.showMessage('player_buffering');
            this.onplayFinish();
        });
    };

    /**
  * Description: update ui time
  * @param {_currentTime, _duration} float 
  * @return {null}
  */
    updateUITime = function (_currentTime, _duration) {
        function pad(n, width) {
            n = n + '';
            return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
        }

        var ticks = Math.round(_duration);
        var hh = Math.floor(ticks / 3600);
        var mm = Math.floor((ticks % 3600) / 60);
        var ss = ticks % 60;

        var totalDuration = hh !== 0 ? (pad(hh, 2) + ":" + pad(mm, 2) + ":" + pad(ss, 2)) : pad(mm, 2) + ":" + pad(ss, 2);

        ticks = Math.round(_currentTime);
        hh = Math.floor(ticks / 3600);
        mm = Math.floor((ticks % 3600) / 60);
        ss = ticks % 60;

        var currentDuration = hh !== 0 ? (pad(hh, 2) + ":" + pad(mm, 2) + ":" + pad(ss, 2)) : pad(mm, 2) + ":" + pad(ss, 2);
        this.timeView.innerHTML = currentDuration + '/' + totalDuration;
    };
    showMessage = function (_translateMessageKey) {
        this.messageView.innerHTML = i18next.t(_translateMessageKey) || _translateMessageKey;
    };
    getMessage = function () {
        return this.message;
    };
};



