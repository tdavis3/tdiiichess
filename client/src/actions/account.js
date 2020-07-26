import axios from "axios";
import {setAlert} from "./alert";
import {
    CHANGE_EMAIL,
    GET_USER_ANALYTICS,
    GET_ADMIN_ANALYTICS
} from "./types";
import UserPool from "../config/UserPool";
import {CognitoUserAttribute} from "amazon-cognito-identity-js";


export const changeEmail = (oldEmail, newEmail) => async dispatch => {
    try {
        const user = UserPool.getCurrentUser();
        user.getSession((err, session) => {  // The user should already be logged in
            if (err) {
                console.error();
            }
        });
        const attributes = [
            new CognitoUserAttribute({Name: "email", Value: newEmail})
        ];
        user.updateAttributes(attributes, (err, results) => {
            if (err) console.log(err);
            console.log(results);
            dispatch({type: CHANGE_EMAIL, payload: newEmail});
        });
        const snackbar_success_msg = "Your email was successfully changed.";
        dispatch(setAlert(snackbar_success_msg, "success"));
    } catch (err) {
        console.log(err);
    }
};

export const changePassword = (oldPassword, newPassword) => async dispatch => {
    try {
        const user = UserPool.getCurrentUser();
        user.getSession((err, session) => {  // The user should already be logged in
            if (err) {
                console.error();
            }
        });
        user.changePassword(oldPassword, newPassword, (err, result) => {
            if (err) console.error(err);
            if (result === 'SUCCESS') {
                const snackbar_success_msg = "Your password was successfully changed.";
                dispatch(setAlert(snackbar_success_msg, "success"));
            }
        });
    } catch (err) {
        console.log(err);
    }
};

export const getUserAnalytics = (userId) => async dispatch => {
    try {
        const res = await axios.get(`/api/analytics/users/${userId}`);
        dispatch({type: GET_USER_ANALYTICS, payload: res.data});
    } catch (err) {
        console.log(err);
    }
};

export const getAdminAnalytics = (user_id) => async dispatch => {
    try {
        const res = await axios.get(`/api/analytics/admin/${user_id}`);
        dispatch({type: GET_ADMIN_ANALYTICS, payload: res.data});
    } catch (err) {
        console.log(err);
    }
};
