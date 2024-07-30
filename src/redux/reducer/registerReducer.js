import * as actionType from '../actions/actionTypes';
import { error } from 'loglevel';

const initialState = {
  data: null,
  loading: false,
  error: null,
};

const registerReducer = (state = initialState, action) => {
  // Log the action
  switch (action.type) {
    case actionType.POST_DATA_REQUEST:
      return { ...state, loading: true, error: null };
    case actionType.POST_DATA_SUCCESS:
      console.log('Payload:', action.payload);  // Log the payload
      return { ...state, loading: false, data: action.payload, error: null };
    case actionType.POST_DATA_FAILURE:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
  
};
  

  
  export default registerReducer;