import {
    GET_ADMIN_ANALYTICS,
    GET_USER_ANALYTICS
} from "../actions/types";

const initialState = {
    change_type: null,
    change_msg: null,
    user_analytics: null,
    admin_analytics: null,
    user_loading: true,
    admin_loading: true
};

export default function (state = initialState, action) {
    const {type, payload} = action;
    switch (type) {
        case GET_USER_ANALYTICS:
            return {
                ...state,
                user_analytics: payload,
                user_loading: false,
            };
        case GET_ADMIN_ANALYTICS:
            return {
                ...state,
                admin_analytics: payload,
                admin_loading: false,
            };
        default:
            return state;
    }
};
