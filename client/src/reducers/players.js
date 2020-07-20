import {
    SET_PLAYERS_LOADING,
    PLAYERS_SUCCESS,
    GET_PLAYERS,
    CREATE_PLAYER,
    EDIT_PLAYER,
    DELETE_PLAYER,
    PLAYERS_ERROR,
    CLEAR_PLAYERS
} from "../actions/types";

const initialState = {
    players: {},
    loading: true,
    error: {}
};

export default function (state = initialState, action) {
    const {type, payload} = action;
    switch (type) {
        case SET_PLAYERS_LOADING:
            return {
                ...state,
                loading: true
            };
        case PLAYERS_SUCCESS:
            return {
                ...state,
                loading: false
            };
        case GET_PLAYERS:
            return {
                ...state,
                players: {...state.players, [payload.sectionId]: payload.players},
                loading: false
            };
        case CREATE_PLAYER:
            return {
                ...state,
                players: {...state.players, [payload.sectionId]: [payload.player, ...state.players[payload.sectionId]]},
                loading: false
            };
        case EDIT_PLAYER:
            const updated_players = [];
            state.players.forEach(player => {
                if (player.SK === payload.SK) {
                    updated_players.push(payload);
                } else {
                    updated_players.push(player);
                }
                return;
            });
            return {
                ...state,
                players: updated_players,
                loading: false
            };
        case DELETE_PLAYER:
            return {
                ...state,
                players: state.players.filter(
                    player => !payload.includes(player.player_id._id)
                ),
                loading: false
            };
        case CLEAR_PLAYERS:
            return {
                ...state,
                players: {},
                loading: false
            };
        case PLAYERS_ERROR:
            return {
                ...state,
                error: payload,
                loading: false
            };
        default:
            return state;
    }
}
