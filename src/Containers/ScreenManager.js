import React, { Component } from 'react';
import GeneralScreen from '../Components/Screens/GeneralScreen'
import ScreenA from '../Components/Screens/ScreenA'
import ScreenB from '../Components/Screens/ScreenB'
import ScreenC from '../Components/Screens/ScreenC'
import { withRouter } from "react-router-dom";

class ScreenManager extends Component {

    constructor(props){
        super(props)
        this.handleBack=  this.handleBack.bind(this);
    } 
    componentWillMount(){
        alert("Application Loaded")
    }

    componentDidMount() {
        console.log(this.props)
    }

    componentDidUpdate(prevProps) {
        const nextScreen = this.props.match.params.screenName===undefined?"Home":this.props.match.params.screenName;
        const previousScreen = prevProps.match.params.screenName===undefined?"Home":prevProps.match.params.screenName;
        alert("Current Screen " + previousScreen);      
        alert('Next Screen:'+ nextScreen);
    }

    componentWillReceiveProps() {

    }

    componentWillUnmount() {
       // alert("Screen Getting Umount")
    }

    shouldComponentUpdate() {
        return true;
    }

    componentDidCatch() {

    }

    handleBack(){
        alert("Going to Back Screen")
        this.props.history.goBack()
    }

    screenManagerKeyListen = (data)=>{
        alert("Screen Manager : " + data);
    }

    render() {
        let Screen = <GeneralScreen routerData={this.props} />;
        const BackButton = this.props.history.location.key && <a onClick={ this.handleBack} > Back</a>;

        
        debugger;
        if( this.props.match.params.screenName){
            const ScreenName = this.props.match.params.screenName.toLowerCase();
           
            switch (ScreenName) {
                case 'screena':
                    Screen = <ScreenA routerData={this.props} keyListen = {this.screenManagerKeyListen} > {BackButton} </ScreenA>
                    break;
                case 'screenb':
                    Screen = <ScreenB routerData={this.props} > {BackButton} </ScreenB>
                    break;
                case 'screenc':
                    Screen = <ScreenC routerData={this.props} > {BackButton} </ScreenC>
                    break;
            }
        }
        return (Screen);

    }

}

export default withRouter(ScreenManager);