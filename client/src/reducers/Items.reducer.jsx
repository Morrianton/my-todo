export default (state, action) => {
  switch(action.type) {
    case 'CREATE_ITEM':
      return [action.payload, ...state];
    case 'DELETE_ITEM':
      return state.filter((item) => item.uuid !== action.payload.uuid);
    case 'UPDATE_ITEM':
      return [action.payload, ...state.filter((item) => item.uuid !== action.payload.uuid)];
  }
  throw new Error(`Action type: ${action.type} not recognized.`);
}
