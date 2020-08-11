import {
    SET_PLAYERS_LOADING,
    PLAYERS_SUCCESS,
    GET_PLAYERS,
    CREATE_PLAYER,
    EDIT_PLAYER,
    DELETE_PLAYER,
    PLAYERS_ERROR,
    CLEAR_PLAYERS,
    STOP_PLAYERS_LOADING,
    SET_USCF_SCRAPER_LOADING,
    USCF_SCRAPER_SUCCESS,
    CLEAR_SCRAPER
} from "../actions/types";

const initialState = {
    players: {},
    loading: false,
    scraper: {
        loading: false,
        players: []
    },
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
        case STOP_PLAYERS_LOADING:
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
            const updatedPlayers = [];
            state.players.forEach(player => {
                if (player.SK === payload.SK) {
                    updatedPlayers.push(payload);
                } else {
                    updatedPlayers.push(player);
                }
                return;
            });
            return {
                ...state,
                players: updatedPlayers,
                loading: false
            };
        case DELETE_PLAYER:
            return {
                ...state,
                players: state.players.filter(
                    player => !payload.includes(player.SK)
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
        case SET_USCF_SCRAPER_LOADING:
            return {
                ...state,
                scraper: {
                    ...state.scraper,
                    loading: true
                }
            };
        case USCF_SCRAPER_SUCCESS:
            return {
                ...state,
                scraper: {
                    ...state.scraper,
                    players: payload,
                    loading: false
                }
            };
        case CLEAR_SCRAPER:
            return {
                ...state,
                scraper: {
                    loading: false,
                    players: []
                }
            };
        default:
            return state;
    }
}
