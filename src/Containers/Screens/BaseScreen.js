/**
* Summary: Base Screen Component
* Description: This the base class Extending which screen can be created extending which screen 
               can be created it contains the various methods handleKey,beforeBackScreen,onScreenAfterBack
               onScreenExitForward
* @author Sawan Kumar
* @date  22.06.2018
*/
import { Component } from 'react';
import {connect} from 'react-redux';
import { translate } from 'react-i18next';
import {saveStateOnExitScreen} from '../../actions';
import {bindActionCreators} from 'redux';
import _ from 'lodash';

class BaseScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data:[]
        };
        this.handleKey =  this.handleKey.bind(this);
        this.changeLanguage =  this.changeLanguage.bind(this);
    }

    /**
    * Description: This Could handle Key Event Handle Key 
    * @param {object}  Event 
    * @return {null}
    */
    handleKey(event) {
    }

    /**
     * Description: This method invoked just before doing back screen
     */
    beforeBackScreen = () => {
        window.routerHistory = _.remove(window.routerHistory,(n)=>{
          return  n !== this.state.screen
        });  
    }

    /**
     * This function will be call if screen is loaded fresh not on back
     */
    onScreenLoad= () => {
         this.props.fetchNetworkData();
    }

    /**
     * Description: This method invoked just after coming to back screen
     */
    onScreenAfterBack = () => {
        this.setState((prev)=>{ return this.props.previousData[this.state.screen] });
    }

    /**
     * Description: This method invoked just before going to another screen
     */
    onScreenExitForward = () => {
        let self =  this;
        window.routerHistory = _.remove(window.routerHistory,(n)=>{
           return  n !== self.state.screen
        });        
        window.routerHistory.push(this.state.screen);
        this.props.saveExitScreen(this.state);
    }

    /** 
     * Description:This method must be called to switch/open another screen 
     * @param {string}screenId
     * @param {object} params is meant to be sent to next screen if required in future. 
    */
    goToScreen = (screenId, params) => {
        if(this.props.saveExitScreen){ //condition if no redux is getting done on screen
            this.onScreenExitForward();
        }

        //To be decided if we should call it via screen manager or not.
       this.props.routerData.history.push({
            pathname: '/'+screenId,
            state: { prevPath: this.props.routerData.location.pathname }
        });
    }

    /** 
    *Description:This funtion must be called on back event. 
    */
    handleBack = function () {
        this.beforeBackScreen();
        this.props.routerData.history.goBack();
    }

    /** 
     * Description:This is component life cycle method which also invoke handlekey method 
    */
    componentWillReceiveProps(nextProps) {
        this.onReduxDataLoad(nextProps);
    }

     /** 
     * Description:This method will check if data got after ajax call
     * @param {object} nextProps* 
     */
    onReduxDataLoad = (nextProps) => {
        if ( nextProps.networkData && this.state.data.length <=0) {
            if (Object.keys(nextProps.networkData).length > 0) {
                this.state.data = nextProps.networkData;
            } 
        }
    }

   /** 
     * Description:This method invoke before component get mount and check this screen is loaded via back 
     *             or fresh loaded and also initiate Key Listner
     * 
     */
    componentWillMount() {
        document.addEventListener("keydown", this.handleKey);
        if (this.props.routerData.history.action.toLowerCase() ==="push"){ //for forward
            if(this.props.fetchNetworkData){ //condition if no redux is getting done on screen
                this.onScreenLoad();
            }
        }else{ //for backward
            if(this.props.previousData){ //this condition preventing error if no previous data or redux is running
                this.onScreenAfterBack();
            }
        }
    }

    /** 
     * Description: Remove key listen on unMount 
     */
    componentWillUnmount(){
        document.removeEventListener("keydown", this.handleKey);
    } 

    changeLanguage(lang){
        this.props.i18n.changeLanguage(lang);
    }

}; //class Ends

export default BaseScreen;

/** 
 * Description:This method contains redux method connect which sync data to react component 
 *              and its a mandatory method to screen if it need to use redux
 * @param {class}    componentName 
 * @param {function} actionOnload this parameter is action of redux when screen get load
 * @param {string}   propsOnload  this parameter is reducer name of the redux for which we need data on load
 * @param {objects}  extraActions this parameter is optional, here use can pass extra actions on screen
 * @param {object}   extraProps this parameter is optional , here use can pass extra reducers on screen
 * return {function}
 */
export function invokeConnect(componentName,actionOnload,propsOnload,extraActions,extraProps={}){
    
    function mapDispatchToProps(dispatch){
        return bindActionCreators({fetchNetworkData:actionOnload,saveExitScreen:saveStateOnExitScreen,...extraActions},dispatch);
    }

    function mapStateToProps(state){
        let _obj ={};
        if (Object.keys(extraProps).length > 0) {
            for (var key in extraProps) {
                _obj[key] = state[extraProps[key]];
            }
        }
        return {networkData:state[propsOnload],previousData:state.getScreenStateData,..._obj};
    }

    return connect(mapStateToProps,mapDispatchToProps)(translate('translations')(componentName))
}