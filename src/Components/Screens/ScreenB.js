
import React from 'react';
import { NavLink } from 'react-router-dom';

const ScreenB = (props) => {
    console.log(props)
    const selectedLink = {
        fontWeight: 'bold',
        color: 'red'
    }

    return (<div>
        <header className="App-header">
            <h1 className="App-title">BScreen Name <span>{props.routerData.match.params.screenName}</span></h1>
        </header>
        {props.children}
    </div>);
};


export default ScreenB;

