const initialState = {
  userSignedIn: window.jwt !== null && window.jwt !== undefined
};

export default (state = initialState, action) => {
  switch (action.type) {
    default:
      return state;
  }
}
