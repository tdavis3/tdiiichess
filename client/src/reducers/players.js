import {
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

export default function(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
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
      const updatedplayers = [];
      state.players.map(player => {
        if (player._id === payload._id) {
          updatedplayers.push(payload);
        } else {
          updatedplayers.push(player);
        }
      });
      return {
        ...state,
        players: updatedplayers,
        loading: false
      };
    case DELETE_PLAYER:
      return {
        ...state,
        players: state.players.filter(
          player => !payload.includes(player.playerid._id)
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
