import {
    GET_TOURNAMENTS,
    CREATE_TOURNAMENT,
    EDIT_TOURNAMENT,
    DELETE_TOURNAMENT,
    CLEAR_TOURNAMENTS,
    TOURNAMENTS_ERROR
} from "../actions/types";

const initialState = {
    editing_tournament: null,
    tournaments: [],
    loading: true,
    error: {}
};

export default function (state = initialState, action) {
    const {type, payload} = action;

    switch (type) {
        case GET_TOURNAMENTS:
            return {
                ...state,
                tournaments: payload,
                loading: false
            };
        case CREATE_TOURNAMENT:
            return {
                ...state,
                tournaments: [payload, ...state.tournaments],
                loading: false
            };
        case EDIT_TOURNAMENT:
            const updated_tournaments = [];
            state.tournaments.forEach(tournament => {
                if (tournament._id === payload._id) {
                    updated_tournaments.push(payload);
                } else {
                    updated_tournaments.push(tournament);
                }
            });
            return {
                ...state,
                tournaments: updated_tournaments,
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
