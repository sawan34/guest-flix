import React, { Component } from 'react';
import { BrowserRouter as Router, Route, NavLink ,Switch } from "react-router-dom";

import './App.css';
import GeneralScreen from './Components/Screens/GeneralScreen'

class App extends Component {
  render() {
    return (
      <Router>
         <Switch>
          <Route exact path="/" exact component={GeneralScreen}  />
          <Route exact path="/A/:screenName" component={GeneralScreen}  />
          <Route exact path="/B/:screenName" component={GeneralScreen}  />
          <Route exact path="/C/:screenName" component={GeneralScreen}  />
        </Switch> 
      </Router>
    );
  }
}

export default App;
