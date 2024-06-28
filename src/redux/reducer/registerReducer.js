import { combineReducers } from 'redux';
import * as actionType from '../actions/actionTypes';

const initialState = {
    data: [],
    loading: false,
    error: null,
  };


const registerReducer = (state = initialState, action) => {
    switch (action.type) {
      case actionType.POST_DATA_REQUEST:
        return { ...state, loading: true ,error:null};
      case actionType.POST_DATA_SUCCESS:
        return { ...state, loading: false, data: action.payload };
      case actionType.POST_DATA_FALIURE:
        return { ...state, loading: false, error: action.payload };
      default:
        return state;
    }
  };
  

  
  export default registerReducer;