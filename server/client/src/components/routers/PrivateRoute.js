import React from 'react';

import { Redirect, Route } from 'react-router-dom';

// from https://stackoverflow.com/questions/43164554/how-to-implement-authenticated-routes-in-react-router-4
const PrivateRoute = ({ component: Component, authed, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props =>
        authed === true
          ? <Component {...props} />
          : <Redirect
              to={{ pathname: '/login', state: { from: props.location } }}
            />}
    />
  );
};

export default PrivateRoute;