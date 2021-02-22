import session from '../../services/session';

export default {
  login: false,
  loginError: false,
  userSignedIn: session.isAuthenticated()
};
