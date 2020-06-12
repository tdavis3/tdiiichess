import axios from "axios";
import {setAlert} from "./alert";
import {
    USER_LOADED,
    GET_USER_ANALYTICS,
    GET_ADMIN_ANALYTICS
} from "./types";


export const changeEmail = (old_email, new_email) => async dispatch => {
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    };
    const body = JSON.stringify({old_email, new_email});
    try {
        const res = await axios.put("/api/users", body, config);
        // Check if res.data.result === 1
        if (res.data.err === 11000) {
            const snackbar_fail_msg = "There is already an account associated with this email.";
            dispatch(setAlert(snackbar_fail_msg, "error"));
            return;
        }
        const snackbar_success_msg = "Your email was successfully changed.";
        dispatch(setAlert(snackbar_success_msg, "success"));
        // Load the updated user
        dispatch({type: USER_LOADED, payload: res.data.updated_user});
    } catch (err) {
        console.log(err);
    }
};

export const changePassword = (user_id, old_password, new_password) => async dispatch => {
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    };
    const body = JSON.stringify({user_id, old_password, new_password});
    try {
        const res = await axios.put(`/api/users/${user_id}`, body, config);
        // Check if res.data.result === 1
        if (res.data.err === "Passwords don't match") {
            const snackbar_fail_msg = "You entered an incorrect old password. Try again.";
            dispatch(setAlert(snackbar_fail_msg, "error"));
            return;
        }
        const snackbar_success_msg = "Your password was successfully changed.";
        dispatch(setAlert(snackbar_success_msg, "success"));
    } catch (err) {
        console.log(err);
    }
};

export const getUserAnalytics = (user_id) => async dispatch => {
    try {
        const res = await axios.get(`/api/analytics/users/${user_id}`);
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
