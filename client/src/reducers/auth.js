import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  CHANGE_EMAIL,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT
} from "../actions/types";
import setAuthToken from "../utils/setAuthToken";

const initialState = {
  token: localStorage.getItem("token"),
  isAuthenticated: null,
  loading: true, // To see if the backend request is already done
  user: null
};

export default function(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: payload
      };
    case LOGIN_SUCCESS:
    case REGISTER_SUCCESS:
      //localStorage.setItem("token", payload.token);
      //setAuthToken(payload.token);
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: payload
      };
    case CHANGE_EMAIL:
        return {
          ...state,
          user: {...state.user, email: payload}
        };
    case LOGOUT:
    case LOGIN_FAIL:
    case AUTH_ERROR:
    case REGISTER_FAIL:
      localStorage.removeItem("token");
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
        user: null
      };
    default:
      return state;
  }
}
