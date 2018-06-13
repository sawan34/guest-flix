
import React from 'react';
import { NavLink } from 'react-router-dom';

const GeneralScreen = (props) => {
    console.log(props)
    const selectedLink = {
        fontWeight: 'bold',
        color: 'red'
    }

    return (<div>
        <header className="App-header">
            <h1 className="App-title">Screen Name <span>{props.match.params.screenName}</span></h1>
        </header>
        <p className="App-intro"></p>
        {props.history.location.key && <a onClick={() => props.history.goBack()} > Back</a>}
        {!props.history.location.key && <div> <NavLink activeStyle={selectedLink} to="/A/screenA" >Screen A</NavLink> 
                                             <NavLink activeStyle={selectedLink} to="/B/screenB">Screen B </NavLink> </div>}

        {props.location.pathname === "/A/screenA" && <NavLink activeStyle={selectedLink} to="/C/screenC" >Screen C </NavLink>}

    </div>);
};


export default GeneralScreen;

