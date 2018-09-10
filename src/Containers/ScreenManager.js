/**
* Summary: Manages for all screen
* Description: This manages loading and unloading screen and also delegates key event to inner component 
* @author Sawan Kumar
* @date  13.06.2018
*/

import React, { Component } from 'react';
import Home from './Screens/Home';
import LoadingScreen from './Screens/LoadingScreen';
import ProgramDetails from './Screens/ProgramDetails';
import Player from '../Component/Player/Player'
import DataLoadingScreen from './Screens/DataLoadingScreen';
import RelatedTitleScreen from './Screens/RelatedTitleScreeen';
import { withRouter } from "react-router-dom";
import { SCREENS } from '../constants/screens.constant';

class ScreenManager extends Component {

    /**
    * Description: handle previous and BackScreen
    * @param {object}   prevProps
    * @return {null}
    */
    componentDidUpdate(prevProps) {
        /*****
         *  This code will be used later
         * const nextScreen = this.props.match.params.screenName===undefined?"Home":this.props.match.params.screenName;
           const previousScreen = prevProps.match.params.screenName===undefined?"Home":prevProps.match.params.screenName;
         */
    }

    /**
     * Description: handle loading of Appropriate Screen
     * @param {object}   
     * @return {object}
     */
    render() {
        console.log("screen Render")
        let Screen = "";
        const ScreenName = this.props.match.params.screenName;
        switch (ScreenName) {
            case SCREENS.home:
                Screen = <Home routerData={this.props} />;
                break;
            case SCREENS.programdetails:
                Screen = <ProgramDetails routerData={this.props} />;
                break;
            case SCREENS.player:
                Screen = <Player routerData={this.props} />;
                break;
            case SCREENS.dataloading:
                Screen = <DataLoadingScreen routerData={this.props} />
                break;
            case SCREENS.relatedtitle:
                Screen = <RelatedTitleScreen routerData={this.props} />
                break;   
            default:
                Screen = <LoadingScreen routerData={this.props} />;
                break
        }
        return (Screen);

    }

}

export default withRouter(ScreenManager);