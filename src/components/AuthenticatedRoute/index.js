import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import session from '../../services/session';

const AuthenticatedRoute = ({ component, ...rest }) => (
  <Route
    {...rest}
    render={(props) => {
      if (!session.isAuthenticated()) {
        console.log('test!');
        return <Redirect to='/login' />;
      } else {
        console.log('problem');
      }

      const AuthenticatedComponent = component;
      return <AuthenticatedComponent {...props} />;
    }}
  />
);

export default AuthenticatedRoute;
