/**
 * A React reducer function for updating User data.
 * @param {Object} state  User object containing a user's data.
 * @param {Object} action The action object determining how the state should be updated.
 * @returns the updated state.
 */
export default (state, action) => {
  // TODO: add more cases
  switch(action.type) {
    case 'SET_USER':
      return action.payload;
  }

  throw error(`Unknown action: ${action.type}`);
}
