 /**
* Summary: APP js Bootstarp
* Description: Contains Client Side Routing 
* @author Sawan Kumar
* @date  22.06.2018
*/
import React, { Component } from 'react';
import { HashRouter as Router, Route,Switch } from "react-router-dom";
import ScreenManager from './Containers/ScreenManager'
require('font-awesome/css/font-awesome.min.css');
require('./Containers/css/style.css');

class App extends Component {
  render() {
    return (
      <Router>
         <Switch>
          <Route exact path="/"   component={ScreenManager}  />
          <Route exact path="/:screenName"  component={ScreenManager}  />
          <Route exact path="/:screenName/:id"  component={ScreenManager}  />

        </Switch> 
      </Router>
    );
  }
}

export default App;
