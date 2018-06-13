
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
            <h1 className="App-title">Screen Name <lg_red>{props.screenName}</lg_red></h1>
        </header>
        <p className="App-intro"></p>
        {props.history.location.key && <a onClick={() => props.history.goBack()} > Back</a>}
        {!props.history.location.key && <div> <NavLink activeStyle={selectedLink} to="/A" >A</NavLink> 
                                             <NavLink activeStyle={selectedLink} to="/B">B </NavLink> </div>}

        {props.location.pathname === "/A" && <NavLink activeStyle={selectedLink} to="/C" >C </NavLink>}

    </div>);
};

GeneralScreen.defaultProps = {
    screenName: ""
}
export default GeneralScreen;

