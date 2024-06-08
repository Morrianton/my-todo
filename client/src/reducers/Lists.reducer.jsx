/**
 * A React reducer function for updating List data.
 * @param {Object} state  Lists object containing an array of Lists.
 * @param {Object} action The action object determining how the state should be updated.
 * @returns the updated state.
 */
export default (state, action) => {
  switch(action.type) {
    case 'SET_LISTS':
      return {
        lists: action.payload
      };
    case 'CREATE_LIST':
      return {
        lists: [action.payload, ...state.lists]
      };
    case 'DELETE_LIST':
      return {
        lists: state.lists.filter((list) => list._id !== action.payload._id)
      };
    case 'UPDATE_LIST':
      return {
        lists: [action.payload, state.lists.filter((list) => list._id !== action.payload._id)]
      };
    };
    throw error(`Unknown action: ${action.type}`);
};
