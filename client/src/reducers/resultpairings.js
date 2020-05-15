import {
    GENERATE_PAIRINGS,
    GET_PAIRINGS,
    DELETE_PAIRING,
    UPDATE_RESULT,
    PAIRING_ERROR
} from "../actions/types";

const initialState = {
    resultpairings: [],
    loading: true,
    error: {}
};

export default function (state = initialState, action) {
    const {type, payload} = action;
    switch (type) {
        case GET_PAIRINGS:
            return {
                ...state,
                resultpairings: payload,
                loading: false
            };
        case GENERATE_PAIRINGS:
            return {
                ...state,
                resultpairings: [...state.resultpairings, payload],
                loading: false
            };
        case DELETE_PAIRING:
            return state;
        case PAIRING_ERROR:
            return {
                ...state,
                error: payload,
                loading: false
            };
        default:
            return state;
    }
}
