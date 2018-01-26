import React from 'react';
import { connect } from 'react-redux';
import { verifyToken } from '../actions';
import Authentication from './auth';
import axios from 'axios';

class Header extends React.Component {
  render() {
    return (
      <div>
        {verifyToken(this.props.dispatch, localStorage.getItem('jwt')) ? (
          <p>Welcome to the app!</p>
        ) : (
          <Authentication />
        )}
        <button onClick={async () => {
					const payload = {
						token: localStorage.getItem('jwt')
          };
          console.log('********* Begin payload');
          console.log(payload);
          console.log('*********** End payload')
          const res = await axios.post('/api/test', payload);
          console.log('********** Begin response body');
          console.log(res.body);
          console.log('********** End response body');
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
