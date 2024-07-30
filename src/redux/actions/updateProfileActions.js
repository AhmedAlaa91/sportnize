import * as actionTypes from './actionTypes';
import {updateProfileApi} from '../../api/updateProfileApi';
import * as log from 'loglevel';



export const putProfileRequest = () => {
    return {
      type: actionTypes.PUT_PROFILE_REQUEST,
    };
  };
  
  export const putProfileSuccess = (data) => {
    return {
      type: actionTypes.PUT_PROFILE_SUCCESS,
      payload: data,
    };
  };
  
  export const putProfileFailure = (error) => {
    return {
      type: actionTypes.PUT_PROFILE_FALIURE,
      payload: error,
    };
  };


  export const updateaProfile = (id,body) => async (dispatch) => {
    
    console.log('profile api');
    dispatch(putProfileRequest());
    try {
      const response = await updateProfileApi(id,body)
      dispatch(putProfileSuccess(response.data));
    } catch (error) {
        if (error) { // Check for non-200 status code
            throw new Error(`Update Profile failed: ${error.message || 'Bad request'}`); // Throw error
          }
        dispatch(putProfileFailure(error.message));
    }
  };