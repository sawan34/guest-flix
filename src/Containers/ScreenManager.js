import React, { Component } from 'react';
import GeneralScreen from '../Components/Screens/GeneralScreen'
import ScreenA from '../Components/Screens/ScreenA'
import ScreenB from '../Components/Screens/ScreenB'
import ScreenC from '../Components/Screens/ScreenC'
import keyCode from '../common/KeyMap'
import { withRouter } from "react-router-dom";

class ScreenManager extends Component {

    constructor(props){
        super(props)
        this.handleBack=  this.handleBack.bind(this);
        this.state =  {
            keyPressCode : 0
        }
    } 
    componentWillMount(){
        document.addEventListener("keydown", this._handleKeyDown.bind(this));
    }

    componentDidMount() {
      //  console.log(this.props)
    }

    componentDidUpdate(prevProps) {
        const nextScreen = this.props.match.params.screenName===undefined?"Home":this.props.match.params.screenName;
        const previousScreen = prevProps.match.params.screenName===undefined?"Home":prevProps.match.params.screenName;
        console.log("Current Screen " + previousScreen);      
        console.log('Next Screen:'+ nextScreen);
    }

    componentWillReceiveProps() {

    }

    componentWillUnmount() {
       // console.log("Screen Getting Umount")
    }

    
    componentDidCatch() {

    }

    handleBack(){
        console.log("Going to Back Screen")
        this.props.history.goBack()
    }

    screenManagerKeyListen = (data)=>{
        console.log("Screen Manager : " + data);
    }


    _handleKeyDown (event) {
        console.log(event.keyCode);
        if(event.keyCode ===keyCode.VK_BACK){
            this.handleBack();
        }
      this.setState({keyPressCode:event.keyCode})
    }

    render() {
        console.log(this.props);
        let Screen = <GeneralScreen routerData={this.props} keyPressCode = {this.state.keyPressCode} />;
        const BackButton = this.props.location.pathname !=="/" && <a   onClick={ this.handleBack} > Back</a>;
      
        if( this.props.match.params.screenName){
            const ScreenName = this.props.match.params.screenName.toLowerCase();
            console.log(ScreenName);
            switch (ScreenName) {
                case 'screena':
                    Screen = <ScreenA routerData={this.props} keyListen = {this.screenManagerKeyListen} keyPressCode = {this.state.keyPressCode} > {BackButton} </ScreenA>
                    break;
                case 'screenb':
                    Screen = <ScreenB routerData={this.props} keyPressCode = {this.state.keyPressCode} > {BackButton} </ScreenB>
                    break;
                case 'screenc':
                    Screen = <ScreenC routerData={this.props}  keyPressCode = {this.state.keyPressCode} > {BackButton} </ScreenC>
                    break;
            }
        }
        return (Screen);

    }

}

export default withRouter(ScreenManager);