import * as actionTypes from './actionTypes';
import {fetchProfileApi} from '../../api/fetchProfileApi';
import * as log from 'loglevel';



export const fetchProfileRequest = () => {
    return {
      type: actionTypes.FETCH_PROFILE_REQUEST,
    };
  };
  
  export const fetchProfileSuccess = (data) => {
    return {
      type: actionTypes.FETCH_PROFILE_SUCCESS,
      payload: data,
    };
  };
  
  export const fetchProfileFailure = (error) => {
    return {
      type: actionTypes.FETCH_PROFILE_FALIURE,
      payload: error,
    };
  };


  export const fetcharofile = (id) => async (dispatch) => {
    dispatch(fetchProfileRequest());
    try {
      const response = await fetchProfileApi(id)
      dispatch(fetchProfileSuccess(response.data));
    } catch (error) {
        if (error) { // Check for non-200 status code
            throw new Error(`fetch profile failed: ${error.message || 'Bad request'}`); // Throw error
          }
        dispatch(fetchProfileFailure(error.message));
    }
  };