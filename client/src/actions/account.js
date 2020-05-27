import axios from "axios";
import {
    USER_LOADED,
    CHANGE_EMAIL_SUCCESS,
    CHANGE_EMAIL_FAIL,
} from "./types";


export const change_email = (old_email, new_email) => async dispatch => {
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
            dispatch({type: CHANGE_EMAIL_FAIL, payload: {type: 'error', msg: snackbar_fail_msg}});
            return;
        }
        const snackbar_success_msg = "Your email was successfully changed.";
        dispatch({type: CHANGE_EMAIL_SUCCESS, payload: {type: 'success', msg: snackbar_success_msg}});
        // Load the updated user
        dispatch({type: USER_LOADED, payload: res.data.updated_user});
    } catch (err) {
        console.log(err);
    }
};
