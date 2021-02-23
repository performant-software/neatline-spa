/**
 * Class to handle storing session authentication information.
 */
class Session {
  /**
   * Saves the passed token in the session.
   *
   * @param token
   */
  create(token) {
    sessionStorage.setItem('token', token);
  }

  /**
   * Removes the current token from the session.
   */
  destroy() {
    sessionStorage.removeItem('token');
  }

  /**
   * Returns true if the session is authenticated.
   *
   * @returns {boolean}
   */
  isAuthenticated() {
    return !!sessionStorage.getItem('token');
  }

  /**
   * Returns the token for the current session.
   *
   * @returns {string}
   */
  restore() {
    return sessionStorage.getItem('token');
  }
}

export default new Session();
