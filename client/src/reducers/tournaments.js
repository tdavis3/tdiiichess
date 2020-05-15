import {
  GET_TOURNAMENTS,
  CREATE_TOURNAMENT,
  EDIT_TOURNAMENT,
  DELETE_TOURNAMENT,
  CLEAR_TOURNAMENTS,
  TOURNAMENTS_ERROR
} from "../actions/types";

const initialState = {
  editingtournament: null,
  tournaments: [],
  loading: true,
  error: {}
};

export default function(state = initialState, action) {
  const { type, payload } = action;

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
      const updatedtourneys = [];
      state.tournaments.map(tourney => {
        if (tourney._id === payload._id) {
          updatedtourneys.push(payload);
        } else {
          updatedtourneys.push(tourney);
        }
      });
      return {
        ...state,
        tournaments: updatedtourneys,
        loading: false
      };
    case DELETE_TOURNAMENT:
      return {
        ...state,
        tournaments: state.tournaments.filter(
          tourney => !payload.includes(tourney._id)
        ),
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
