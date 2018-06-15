
import React , { PureComponent } from 'react';
import { NavLink } from 'react-router-dom';
import keyCode from '../../common/KeyMap'

 

class ScreenA extends PureComponent {
   
constructor(props){
    super(props)
    this.onScreenAction =  this.onScreenAction.bind(this);
    this.state ={
        nav:0
    }
}

componentDidUpdate(prevProps, prevState, snapshot){
    console.log("Screen A Loaded")
    if(prevState.nav === this.state.nav){
         this.handleKeyA(this.props.keyPressCode);
    }
}
handleKeyA = (key) =>{
  if(keyCode.VK_LEFT ===key || keyCode.VK_RIGHT ===key){  
            console.log("ScreenA key Code "+ key)
            if(this.state.nav===2){
                this.setState({nav:0})
            }else{
                this.setState((prevState)=>{
                        return {
                            nav:prevState.nav+1
                        }
                })
            }
    }
    if(keyCode.VK_ENTER ===key ){  
        if(this.state.nav===1){
            this.handleClick();
        }

        if(this.state.nav===0){
           this.props.routerData.history.push("/screenC")
        }

        if(this.state.nav===2){
            this.props.routerData.history.goBack()
         }
    } 
}

onScreenAction = ()=>{
        alert("On Screen Action")
    }   

handleBack(){
        alert("ppp")
       // this.props.history.goBack()
    }

handleClick = ()=>{
    alert("Screen Indivisuial : Screen C");
    this.props.keyListen("Screen C");
}

render(){
        return (<div>
            <header className="App-header">
                <h1 className="App-title">Screen Name <span>{this.props.routerData.match.params.screenName}</span></h1>
            </header>
            <NavLink className={this.state.nav===0 ? "selectedAtt":"non-sel"} to="/screenC" >Screen C </NavLink>
            <a  className={this.state.nav===1 ? "selectedAtt":"non-sel"} onClick={this.handleClick.bind(this)} >Click to See Action</a>
            <span className={this.state.nav===2 ? "selectedAtt":"non-sel"}>
                {this.props.children}
            </span>
        </div>);
    }

};


export default ScreenA;

