import { combineReducers } from 'redux';
import registerReducer from './registerReducer';
import profileReducer from './profileReducer';
//root reducers to combine all reducers in one reducer
// see : https://redux.js.org/usage/structuring-reducers/using-combinereducers

const rootReducer = combineReducers({
  // Your reducers will go here
  data: registerReducer,
  profile: profileReducer,
});

export default rootReducer;
