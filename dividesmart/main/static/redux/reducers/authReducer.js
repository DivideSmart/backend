
import { SET_CURRENT_USER } from '../actions/types';

const initialStore = {
  user: {
    usernmae: '',
    emailAddress: '',
    isAuthenticated: false,
    portraitUrl: '/media/portrait/default_portrait.png',
  },
};

export default function(state = initialStore, action) {
  switch (action.type) {
    case SET_CURRENT_USER:
      console.log("set current user action");
      return {
        ...state,
        user: action.payload
      };
    default:
      return state;
  }
}
