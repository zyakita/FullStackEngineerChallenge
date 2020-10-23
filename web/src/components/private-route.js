import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import jwtDecode from 'jwt-decode';

const PrivateRoute = ({ component: Component, ...rest }) => {
  let isValidToken = false;

  // get token from localStorage & check expired date
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.accessToken) {
    const jwt = user.accessToken;
    const tokenExpiration = jwtDecode(jwt).exp;
    const dateNow = new Date();
    if (tokenExpiration > dateNow.getTime() / 1000) {
      isValidToken = true;
    } else {
      // logout user
      localStorage.removeItem('user');
    }
  }

  return (
    <Route
      {...rest}
      render={(props) =>
        isValidToken ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: props.location },
            }}
          />
        )
      }
    />
  );
};

export default PrivateRoute;
