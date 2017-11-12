const defaultState = {
    dummyToggleState: false
};

export default (state = defaultState, action) => {
    switch(action.type)
    {
        case 'APP_DUMMY_TOGGLE':
            return _.merge({}, state, {
                dummyToggleState: !(state.dummyToggleState === true)
            });
    }
    return state;
}
