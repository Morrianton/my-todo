/**
 * A React reducer function for updating List data.
 * @param {Object} state  Lists object containing an array of Lists.
 * @param {Object} action The action object determining how the state should be updated.
 * @returns the updated state.
 */
export default (state, action) => {
  switch(action.type) {
    case 'SET_LISTS':
      return [action.payload];
    case 'CREATE_LIST':
      return [action.payload, ...state];
    case 'DELETE_LIST':
      return state.filter((list) => list._id !== action.payload._id);
    case 'UPDATE_LIST':
      console.log(state)
      return [action.payload, ...state.filter((list) => list._id !== action.payload._id)];
    };
    throw new Error(`Unknown action: ${action.type}`);
};
