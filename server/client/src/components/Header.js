import React from 'react';
import { connect } from 'react-redux';
import { verifyToken } from '../actions';
import Authentication from './auth';
import axios from 'axios';

class Header extends React.Component {
  render() {
    const rawToken = localStorage.getItem('jwt');
    console.log(rawToken);
    const token = rawToken ? JSON.parse(rawToken) : undefined;
    console.log(token);
    return (
      <div>
        {verifyToken(this.props.dispatch, token) ? (
          <p>Welcome to the app!</p>
        ) : (
          <Authentication />
        )}
        <button onClick={async () => {
					const payload = {
						token: token ? JSON.parse(localStorage.getItem('jwt')).encoded : 'null'
          };
          await axios.post('/api/test', payload);
				}}>Test</button>
      </div>
    );
  }
}

const mapStateToProps = ({ token }) => {
  return {
    token
  };
};

export default connect(mapStateToProps)(Header);
