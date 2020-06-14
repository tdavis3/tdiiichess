import {
    SET_PLAYERS_LOADING,
    PLAYERS_SUCCESS,
    GET_PLAYERS,
    CREATE_PLAYER,
    EDIT_PLAYER,
    DELETE_PLAYER,
    PLAYERS_ERROR
} from "../actions/types";

const initialState = {
    players: [],
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
                players: payload,
                loading: false
            };
        case CREATE_PLAYER:
            return {
                ...state,
                players: [payload, ...state.players],
                loading: false
            };
        case EDIT_PLAYER:
            const updated_players = [];
            state.players.forEach(player => {
                if (player._id === payload._id) {
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
