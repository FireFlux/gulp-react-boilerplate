import {combineReducers} from 'redux';

import app from 'reducers/app';

const allReducers = combineReducers({
    app: app,
});

export default allReducers;
