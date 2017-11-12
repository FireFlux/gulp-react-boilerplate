import "babel-polyfill";
import React from 'react';
import ReactDOM from 'react-dom';
import {createStore, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import thunk from 'redux-thunk';
import reduxLogger from 'redux-logger';

import allReducers from 'reducers/index';
import App from 'containers/app';

let middleware = [thunk];

if (process.env.NODE_ENV !== 'production')
{
    middleware = [...middleware, reduxLogger];
}

const store = createStore(
    allReducers,
    applyMiddleware(...middleware)
);

ReactDOM.render(
    <Provider store={store}>
        <App/>
    </Provider>,
    document.getElementsByClassName('app')[0]
);
