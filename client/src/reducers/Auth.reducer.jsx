/**
 * A React reducer function for Authenticating a user.
 * @param {Object} state  User object containing a user's data.
 * @param {Object} action The action object determining how the state should be updated.
 * @returns the updated state.
 */
export default (state, action) => {
  switch(action.type) {
    case 'LOG_IN':
      return action.payload;
    case 'LOG_OUT':
      return null;
  };
  throw error(`Unknown action: ${action.type}`);
}
