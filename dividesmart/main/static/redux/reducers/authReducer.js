
import { SET_CURRENT_USER } from '../actions/types';

const initialState = {
  isAuthenticated: false,
  user: {HIEU: "AA"}
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_CURRENT_USER:
      console.log("HERE ROI DISPATCH");
      console.log(action.payload);
      return {
        ...state,
        isAuthenticated: !isEmpty(action.payload),
        user: action.payload
      };
    default:
      return state;
  }
}
