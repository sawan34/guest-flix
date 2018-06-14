import React, { Component } from 'react';
import { BrowserRouter as Router, Route, NavLink ,Switch } from "react-router-dom";

import './App.css';
import ScreenManager from './Containers/ScreenManager'

class App extends Component {


  render() {
    return (
      <Router>
         <Switch>
          <Route exact path="/"   component={ScreenManager}  />
          <Route exact path="/:screenName"  component={ScreenManager}  />
        </Switch> 
      </Router>
    );
  }
}

export default App;
