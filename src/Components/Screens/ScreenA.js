
import React , { Component } from 'react';
import { NavLink } from 'react-router-dom';

 

class ScreenA extends Component {
   
constructor(props){
    super(props)
    this.onScreenAction =  this.onScreenAction.bind(this)
}

componentWillMount(){
    alert("Screen A Loaded")
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
    this.props.keyListen("Screen C")
   
}

render(){
        const selectedLink = {
            fontWeight: 'bold',
            color: 'red'
        };
        return (<div>
            <header className="App-header">
                <h1 className="App-title">Screen Name <span>{this.props.routerData.match.params.screenName}</span></h1>
            </header>
            <a onClick={this.handleClick.bind(this)} >Click to See Action</a>
            <NavLink activeStyle={selectedLink} to="/screenC" >Screen C </NavLink>
            {this.props.children}
        </div>);
    }

};


export default ScreenA;

