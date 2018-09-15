import axios from 'axios';

import { GET_ERRORS, SET_CURRENT_USER } from './types';

// Set logged in user
export const setCurrentUser = decoded => {
  console.log("DISPATCH ACTION");
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  };
};

// Log user out
export const logoutUser = () => dispatch => {
  // Remove token from localStorage
  // localStorage.removeItem('jwtToken');
  // // Remove auth header for future requests
  // setAuthToken(false);
  // Set current user to {} which will set isAuthenticated to false
  dispatch(setCurrentUser({}));
};
