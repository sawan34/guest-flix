/**
* Summary: Loading Screen Component
* Description: This the first Screen get Load 
* @author Akash Sharma
* @date  22.06.2018
*/
import React from 'react';
import BaseScreen, { invokeConnect } from './BaseScreen';
import { SCREENS } from '../../constants/screens.constant';
import logo from '../images/logo-lodingpage.jpg';
import AuthService from '../../services/AuthenticationService'
import { alertConstants } from '../../constants/alert.constant'
import { commonConstants } from '../../constants/common.constants'
import actionGroupings from '../../actions/action.groupings';
import actionUIConfig from '../../actions/action.UIConfig';
import { Md5 } from 'ts-md5/dist/md5';
class LoadingScreen extends BaseScreen {

    constructor() {
        super();
        this.state = {
            ...this.state,
            screen: SCREENS.loading,//This is mandatory for all the screens 
        }
    }

    /**
     * Initialize Screen 
     * Calling Auth APi
     */
    init() {
        this.getAuthTokenRequest();
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
     *  2. Sequencial calling for Grouping API 
     *  3. Go to Home Screen
     */
    componentDidUpdate() {
        if (this.props.UIConfigReducer.type === alertConstants.SUCCESS &&  this.props.UIConfigReducer.message.status === 200) {
            if (Object.keys(this.props.groupingsReducer).length === 0) {
                this.props.groupingAction();
            }
            else {
                if (this.props.UIConfigReducer.type === alertConstants.SUCCESS && this.props.UIConfigReducer.message.status === 200) {
                    setTimeout(() => {
                        this.goToScreen("home")
                    }, 2000);
                }
            }
        }
    }

    /**
     * Store the Auth Data in Local Storage 
     * @param {*} authDetails  
     */
    setTokenToStorage(authDetails) {
        localStorage.setItem(commonConstants.AUTH_TOKEN_STORAGE, authDetails);
    }

    /**
    * Request the AUTH Service to get the AUTH API and store in Local Storage in String format
    * Calling Action for UiConfig Data
    * @param {*} siteId 
    * @param {*} roomId 
    */
    getAuthTokenRequest() {
        const siteId = '13532', room = '101';
        const key = Md5.hashStr(siteId + room);
        const queryParameter = "?siteId=" + siteId + "&room=" + room + "&key=" + key;
        AuthService.getTokenRequest(queryParameter).then((response) => {
            if (response.type === alertConstants.SUCCESS && response.message.status === 200)
                this.setTokenToStorage(JSON.stringify(response.message.data[0]))
            if (AuthService.getAccessToken().length > 10) {
                this.props.UIConfigAction();
            }
        })
    }


    /**
     * Description: check if need to re-render or not
     * @param {object}  nextProps
     * @param {object} nextState
     * @return {Boolean} 
     */
    shouldComponentUpdate(nextProps, nextState) {
        return true;
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
                    <div className="loading-container">
                        <div className="loading-logo"><img src={logo} /></div>
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
    UIConfigAction: actionUIConfig,
    groupingAction: actionGroupings,
}, {
        UIConfigReducer: 'getUiConfig',
        groupingsReducer: 'getGrouings',
    });


