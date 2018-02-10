import React from 'react';
import { connect } from 'react-redux';
import { verifyToken } from '../../actions';
import { Link } from 'react-router-dom';
import SignedInHeader from './SignedInHeader';
import SignedOutHeader from './SignedOutHeader';

class Header extends React.Component {
  render() {
    const rawToken = localStorage.getItem('jwt');
    const token = rawToken ? JSON.parse(rawToken) : undefined;
    return (
      <div>
        <Link to='/'>
          Home
        </Link>
        {verifyToken(this.props.dispatch, token) ? (
          <div>
            <SignedInHeader />
          </div>
        ) : (
          <div>
              <SignedOutHeader />
          </div>
          
        )}
        {/* <button onClick={async () => {
					const payload = {
						token: rawToken ? JSON.parse(localStorage.getItem('jwt')).encoded : 'null'
          };
          await axios.post('/api/test', payload);
				}}>Test</button> */}
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
