import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { Login, SignUp } from './auth';
import Header from './Header/Header'


class App extends React.Component {


    render() {
        return (
            <BrowserRouter>
                <div>
                    <Header />
                    <Route path='/login' component={Login} exact={true} />
                    <Route exact path='/signup' component={SignUp} />
                </div>
            </BrowserRouter>
        );
    }
}

export default connect()(App);