import axios from "axios";
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT
} from "./types";
import { setAlert } from "./alert";
import {AuthenticationDetails, CognitoUser, CognitoUserAttribute} from "amazon-cognito-identity-js";
import UserPool from "../config/UserPool";
import setAuthToken from "../utils/setAuthToken";

export const loadUser = () => async dispatch => {
  try {
    const user = UserPool.getCurrentUser();
    console.log(user);
    if (user) {
        user.getSession((err, session) => {
            if (err) {console.error();}
            console.log("already logged in");
            console.log(session);
            setAuthToken(session.getIdToken().getJwtToken());
            dispatch({ type: USER_LOADED, payload: session.idToken.payload });
        });
    }
  } catch (err) {
    dispatch({ type: AUTH_ERROR });
  }
};

// Register User
export const register = ({firstName, lastName, email, password}) => async dispatch => {
  try {
    const firstNameAttribute = new CognitoUserAttribute({
        Name: 'given_name',
        Value: firstName
    });
    const lastNameAttribute = new CognitoUserAttribute({
        Name: 'family_name',
        Value: lastName
    });
    const phoneNumberAttribute = new CognitoUserAttribute({
        Name: 'phone_number',
        Value: '+19172142571'
    });
    UserPool.signUp(email, password, [firstNameAttribute, lastNameAttribute, phoneNumberAttribute], null, (err, data) => {
        if (err) console.error(err);
        console.log(data);
        /*
        TODO: Consider options for signUp
            - Add pre-lambda trigger to automatically confirm a user so they don't have to
        */
        // login(email, password);
        // dispatch({ type: REGISTER_SUCCESS, payload: res.data });  // Probably not needed
        // TODO: Automatically sign them in after a successful signUp
   });
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, "error")));
    }
    dispatch({ type: REGISTER_FAIL });
  }
};

// Login User
export const login = (email, password) => async dispatch => {
  try {
    const user = new CognitoUser({
      Username: email,
      Pool: UserPool
    });
    const authDetails = new AuthenticationDetails({
      Username: email,
      Password: password
    });
    user.authenticateUser(authDetails, {
      onSuccess: data => {
          console.log('onSuccess:', data);
          dispatch({ type: LOGIN_SUCCESS, payload: data.idToken.payload });
      },
      onFailure: err => {
          console.log('onFailure:', err);
      },
      newPasswordRequired: data => {
          console.log('newPasswordRequired:', data);
      }
    });
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, "error")));
    }
    dispatch({ type: LOGIN_FAIL });
  }
};

// Logout
export const logout = () => async dispatch => {
  const user = UserPool.getCurrentUser();
  if (user) {
    user.signOut();
  }
  dispatch({ type: LOGOUT });
};
