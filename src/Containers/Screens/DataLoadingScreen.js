/**
* Summary: Loading Screen Component
* Description: This the first Screen get Load 
* @author Amit Singh Tomar
* @date  02.08.2018
*/
import React from 'react';
import BaseScreen, { invokeConnect } from './BaseScreen';
import { SCREENS } from '../../constants/screens.constant';
import actionGroupings from '../../actions/action.groupings';
import actionUIConfig from '../../actions/action.UIConfig';
import { validCodes } from '../../constants/error.constant'
import { alertConstants } from '../../constants/alert.constant';


class DataLoadingScreen extends BaseScreen {

    constructor() {
        super();
        this.isdataload = false;
        this.state = {
            ...this.state,

            screen: SCREENS.dataloading,//This is mandatory for all the screens 
        }
    }

    /**
    * Initialize Screen 
    */
    init() {
        this.props.uiConfigAction(this.props.routerData.match.params);
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
     *  2. Go to Home Screen
     */
    componentDidUpdate() {
        if (this.props.uiConfigReducer.type === alertConstants.SUCCESS && validCodes(this.props.uiConfigReducer.message.status)) {
            if (!this.isdataload) {
                this.props.groupingAction();
                this.isdataload = true;
            }
            else {
                if (this.props.groupingsReducer.type === alertConstants.SUCCESS && validCodes(this.props.groupingsReducer.message.status)) {
                    this.goToScreen("home")
                }
            }
        }

    }

    /**
     * Description:This code is for mounting HTML on Browser
     * @param {null} 
     * @return {null}
     */
    render() {
        return (
            <div>
                "Loading ......."
            </div>
        );
    }
};

export default invokeConnect(DataLoadingScreen, null, '', {
    uiConfigAction: actionUIConfig,
    groupingAction: actionGroupings,
}, {
        uiConfigReducer: 'getUiConfig',
        groupingsReducer: 'getGroupings',
    });
