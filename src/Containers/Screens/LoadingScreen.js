/**
* Summary: Loading Screen Component
* Description: This the first Screen get Load 
* @author Akash Sharma
* @date  22.06.2018
*/
import React from 'react';
import BaseScreen, { invokeConnect } from './BaseScreen';
import AuthService from '../../services/service.authentication';
import RoomUserService from '../../services/service.roomUser';
import actionGroupings from '../../actions/action.groupings';
import actionUIConfig from '../../actions/action.UIConfig';
import utility from '../../commonUtilities';
import { SCREENS } from '../../constants/screens.constant';
import { Md5 } from 'ts-md5/dist/md5';
import { validCodes } from '../../constants/error.constant'
import { alertConstants } from '../../constants/alert.constant';
import { commonConstants } from '../../constants/common.constants'
import DrmService from '../../drm/service.drm.playback';
import i18next from 'i18next';
class LoadingScreen extends BaseScreen {

    constructor() {
        super();
        this.roomId = "";
        this.siteId = "";
        this.state = {
            ...this.state,
            screen: SCREENS.loading,//This is mandatory for all the screens 
            errorMessage: "",
            isError: false
        }
    }

    /**
     * Initialize Screen 
     * Calling Auth APi
     */
    init() {
        this.getAuthTokenRequest();
        DrmService.loadDrmClient();
    }

    /**
     * @ Override the BaseScreen method for initialise the Screen
     */
    componentWillMount() {
        super.componentWillMount();
        this.init();
    }

    /**
     *  @ Override function of Component class
     *  1. Check UiConfig API data either save on redux or not 
     *  2. Sequencial calling for RoomUser API 
     *  3. Go to Home Screen
     */
    componentDidUpdate() {
        if (this.props.uiConfigReducer.type === alertConstants.SUCCESS && validCodes(this.props.uiConfigReducer.message.status)) {
            if (Object.keys(this.props.groupingsReducer).length === 0) {
                this.getRoomUserRequest()
            }
            else {
                if (this.props.groupingsReducer.type === alertConstants.SUCCESS && validCodes(this.props.groupingsReducer.message.status)) {
                    if (!utility.isEmpty(this.props.uiConfigReducer.message.data.defaultPreferences.uiLanguage)) {
                        this.props.i18n.changeLanguage(this.props.uiConfigReducer.message.data.defaultPreferences.uiLanguage);
                    }
                    this.goToScreen("home")
                }
            }
        }
    }

    /**
     * Store the Auth Data in session Storage 
     * @param {*} authDetails  
     */
    setTokenToStorage(storageKey, authDetails) {
        sessionStorage.setItem(storageKey, authDetails);
    }

    /**
    * Request the AUTH Service to get the AUTH API and store in session Storage in String format
    * Calling Action for UiConfig Data
    * check if Access Token Length is greater than 10 , procceed to UiConfig call
    */
    getAuthTokenRequest() {
        this.siteId = utility.getQueryStringValue('siteId');
        this.roomId = utility.getQueryStringValue('room');
        let that = this;
        if (!utility.isEmpty(this.siteId) && !utility.isEmpty(this.roomId)) {
            const key = Md5.hashStr(this.siteId + this.roomId);
            const queryParameter = "?siteId=" + this.siteId + "&room=" + this.roomId + "&key=" + key;
            AuthService.getTokenRequest(queryParameter).then((response) => {
                if (response.type === alertConstants.SUCCESS && validCodes(response.message.status)) {
                    if (response.message.data.length !== 0) {
                        if ((response.message.data[0]).hasOwnProperty("accessToken")) {
                            this.setTokenToStorage(commonConstants.GUEST_AUTH_INFO, JSON.stringify(response.message.data[0]))
                            this.props.uiConfigAction();
                        } else {
                            that.showErrorMessage("token_not_found");
                        }
                    } else {
                        that.showErrorMessage("token_not_found");
                    }
                } else {
                    that.showErrorMessage("url_not_found");
                }
            }).catch(function (error) {
                console.log(error);
                that.showErrorMessage("server_not_found");
            });
        } else {
            that.showErrorMessage("invalid_authentication");
        }
    }

    /**
     * Request the Room User  Service to get the RoomUser API and store in session Storage in String format
     * Calling Action for groupingAction Data
     */
    getRoomUserRequest() {
        let that = this;
        RoomUserService.roomUserRequest(this.roomId).then((response) => {
            if (response.type === alertConstants.SUCCESS && validCodes(response.message.status)) {
                if ((response.message.data[0]).hasOwnProperty("stayId")) {
                    this.setTokenToStorage(commonConstants.GUEST_ROOM_USER_INFO, JSON.stringify(response.message.data[0]))
                    this.props.groupingAction();
                }
            } else {
                that.showErrorMessage("url_not_found");
            }
        }).catch(function (error) {
            console.log(error);
            that.showErrorMessage("server_not_found");
        });
    }

    /**
     * Description:This code is for mounting HTML on Browser
     * @param {_errorMessageKey}   // get language translate key
     * @return {null}
     */
    showErrorMessage(_errorMessageKey) {
        const translateErrorMessage = i18next.t(_errorMessageKey) || _errorMessageKey;
        this.setState({ errorMessage: translateErrorMessage, isError: true });
    }

    /**
     * Description:This code is for mounting HTML on Browser
     * @param {null} 
     * @return {null}
     */
    render() {
        return (
            <div>
                <div className="container">
                    {this.state.isError ? <div className="loading-error-message">{this.state.errorMessage}</div> : ""}
                    <div className="loading-container">
                        <div className="loading-logo"></div>
                        <div className="loading">
                            <div className="loading-wrapper">
                                <div className="loading-circle">
                                    <div className="circle"></div>
                                </div>
                                <div className="loader-text"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
};

export default invokeConnect(LoadingScreen, null, '', {
    uiConfigAction: actionUIConfig,
    groupingAction: actionGroupings,
}, {
        uiConfigReducer: 'getUiConfig',
        groupingsReducer: 'getGroupings',
    });
