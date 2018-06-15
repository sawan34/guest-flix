
import React from 'react';
import { NavLink } from 'react-router-dom';

const GeneralScreen = (props) => {
    const selectedLink = {
        fontWeight: 'bold',
        color: 'red'
    }

    return (<div>
        <header className="App-header">
            <h1 className="App-title">Screen Name <span>{props.routerData.match.params.screenName}</span></h1>
        </header>
        <p className="App-intro"></p>
        {props.routerData.history.location.key && <a onClick={() => props.routerData.history.goBack()} > Back</a>}
        {!props.routerData.history.location.key && <div> <NavLink tabIndex="0" activeStyle={selectedLink} to="/screenA" >Screen A</NavLink> 
                                             <NavLink  activeStyle={selectedLink} to="/screenB">Screen B </NavLink> </div>}


    </div>);
};


export default GeneralScreen;

