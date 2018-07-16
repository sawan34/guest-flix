import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import * as RainbowListDelegate from "./RainbowListDelegate";

import ListView from './solution';

ReactDOM.render(<ListView
       numRows={100}
       rowHeight={RainbowListDelegate.rowHeight}
        renderRowAtIndex={RainbowListDelegate.renderRowAtIndex}
      />, document.getElementById('root'));
registerServiceWorker();
