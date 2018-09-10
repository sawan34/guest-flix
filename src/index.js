import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './i18n';
import store from './store';
import Perf from 'react-addons-perf';
import { Provider } from 'react-redux';
window.Perf = Perf;

ReactDOM.render(<Provider store={ store}><App /></Provider>, document.getElementById('root'));
