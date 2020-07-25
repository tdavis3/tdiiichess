import {
    SET_TOURNAMENTS_LOADING,
    GET_TOURNAMENTS,
    CREATE_TOURNAMENT,
    EDIT_TOURNAMENT,
    DELETE_TOURNAMENT,
    CLEAR_TOURNAMENTS,
    TOURNAMENTS_ERROR,
    DUPLICATE_TOURNAMENT
} from "../actions/types";

const initialState = {
    tournaments: [],
    loading: true,
    error: {}
};

export default function (state = initialState, action) {
    const {type, payload} = action;

    switch (type) {
        case SET_TOURNAMENTS_LOADING:
            return {
                ...state,
                loading: true
            };
        case GET_TOURNAMENTS:
            return {
                ...state,
                tournaments: payload,
                loading: false
            };
        case DUPLICATE_TOURNAMENT:
        case CREATE_TOURNAMENT:
            return {
                ...state,
                tournaments: [payload, ...state.tournaments],
                loading: false
            };
        case EDIT_TOURNAMENT:
            const updatedTournaments = [];
            state.tournaments.forEach(tournament => {
                if (tournament.SK === payload.SK) {
                    updatedTournaments.push(payload);
                } else {
                    updatedTournaments.push(tournament);
                }
            });
            return {
                ...state,
                tournaments: updatedTournaments,
                loading: false
            };
        case DELETE_TOURNAMENT:
            return {
                ...state,
                tournaments: state.tournaments.filter(tournament => tournament._id !== payload),
                loading: false
            };
        case CLEAR_TOURNAMENTS:
            return {
                ...state,
                tournaments: [],
                loading: false
            };
        case TOURNAMENTS_ERROR:
            return {
                ...state,
                error: payload,
                loading: false
            };
        default:
            return state;
    }
}
