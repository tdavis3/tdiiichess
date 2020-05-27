import {
    CHANGE_EMAIL_SUCCESS,
    CHANGE_EMAIL_FAIL,
    CHANGE_PASSWORD_SUCCESS,
    CHANGE_PASSWORD_FAIL,
    REMOVE_ACCOUNT_SNACKBAR
} from "../actions/types";

const initialState = {
    change_type: null,
    change_msg: null,
};

export default function (state = initialState, action) {
    const {type, payload} = action;
    switch (type) {
        case CHANGE_EMAIL_SUCCESS:
        case CHANGE_PASSWORD_SUCCESS:
        case CHANGE_EMAIL_FAIL:
        case CHANGE_PASSWORD_FAIL:
            return {
                ...state,
                change_type: payload.type,
                change_msg: payload.msg,
            };
        case REMOVE_ACCOUNT_SNACKBAR:
            return {
                change_type: null,
                change_msg: null,
            };
        default:
            return state;
    }
};
