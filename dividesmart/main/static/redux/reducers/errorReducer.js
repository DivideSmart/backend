import { GET_ERRORS } from '../actions/types';

const initialStore = {};

export default function(state = initialStore, action) {
  switch (action.type) {
    case GET_ERRORS:
      return action.payload;
    default:
      return state;
  }
}
