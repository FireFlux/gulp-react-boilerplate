import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import {dummyToggle} from 'actions/app';

class App extends Component
{
    constructor(props)
    {
        super(props);
    }

    render()
    {
        return(
            <div ref={(el) => {this.$el = el;}}>
                <h1>Hello World</h1>
                <h2 onClick={() => {
                    this.props.dummyToggle();
                }}>
                    <span>Toggle state: </span>
                    <span>{String(this.props.app.dummyToggleState)}</span>
                </h2>
            </div>
        )
    };
}

function mapStateToProps(state)
{
    return {
        app: state.app
    }
}

function matchDispatchToProps(dispatch)
{
    return bindActionCreators({
        dummyToggle: dummyToggle
    }, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(App);
