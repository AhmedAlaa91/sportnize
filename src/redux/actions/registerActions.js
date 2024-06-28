import * as actionTypes from './actionTypes';
import {registerNewUser} from '../../api/registerApi.js';
import * as log from 'loglevel';



export const postRegisterRequest = () => {
    return {
      type: actionTypes.POST_DATA_REQUEST,
    };
  };
  
  export const postRegisterSuccess = (data) => {
    return {
      type: actionTypes.POST_DATA_SUCCESS,
      payload: data,
    };
  };
  
  export const postRegisterFailure = (error) => {
    return {
      type: actionTypes.POST_DATA_FALIURE,
      payload: error,
    };
  };



  export const registeraNewUser = (body) => async (dispatch) => {
    try {
        dispatch(postRegisterRequest());
      const response = await registerNewUser(body)
      dispatch(postRegisterSuccess(response.data));
      console.log(response);
    } catch (error) {
        dispatch(postRegisterFailure(error.message));
    }
  };