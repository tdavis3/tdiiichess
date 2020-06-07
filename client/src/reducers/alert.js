import {SET_ALERT, REMOVE_ALERT} from "../actions/types";

const initialState = {
    display: false,
    msg: null,
    alertType: null,
    id: null
};

export default function (state = initialState, action) {
    const {type, payload} = action; // Destructuring
    switch (type) {
        case SET_ALERT:
            return {
                ...state,
                display: payload.display,
                msg: payload.msg,
                alertType: payload.alertType,
                id: payload.id
            };
        case REMOVE_ALERT:
            return {
                ...state,
                display: false,
                msg: null,
                alertType: null,
                id: null
            };
        default:
            return state;
    }
}
