import axios from "axios";
import {setAlert} from "./alert";
import {
    SET_TOURNAMENTS_LOADING,
    GET_TOURNAMENTS,
    CREATE_TOURNAMENT,
    EDIT_TOURNAMENT,
    DUPLICATE_TOURNAMENT,
    DELETE_TOURNAMENT,
    TOURNAMENTS_ERROR,
    CLEAR_SECTIONS
} from "./types";

// Get current users tournaments
export const getCurrentTournaments = () => async dispatch => {
    try {
        dispatch({type: SET_TOURNAMENTS_LOADING});
        const res = await axios.get("/api/tournaments");
        dispatch({type: GET_TOURNAMENTS, payload: res.data});
    } catch (err) {
        dispatch({
            type: TOURNAMENTS_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status}
        });
    }
};

// Create new Tournament
export const createTournament = formData => async dispatch => {
    try {
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        };
        dispatch({type: SET_TOURNAMENTS_LOADING});
        const res = await axios.post("/api/tournaments", formData, config);
        dispatch({type: CREATE_TOURNAMENT, payload: res.data});
        dispatch(setAlert("Tournament created", "success"));
    } catch (err) {
        dispatch(setAlert(err.response.data.msg, "error"));
        dispatch({
            type: TOURNAMENTS_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status}
        });
    }
};

// Edit Tournament
export const editTournament = (tournament_id, tournamentFields) => async dispatch => {
    try {
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        };
        dispatch({type: SET_TOURNAMENTS_LOADING});
        const res = await axios.put(
            `/api/tournaments/${tournament_id}`,
            tournamentFields,
            config
        );
        dispatch({type: EDIT_TOURNAMENT, payload: res.data});
        dispatch(setAlert("Tournament edited", "success"));
    } catch (err) {
        dispatch(setAlert(err.response.data.msg, "error"));
        dispatch({
            type: TOURNAMENTS_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status}
        });
    }
};

// Duplicate a tournament
export const duplicateTournament = (tournamentId) => async dispatch => {
    try {
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        };
        dispatch({type: SET_TOURNAMENTS_LOADING});
        const res = await axios.post(`/api/tournaments/${tournamentId}/duplicate`, {}, config);
        dispatch({type: DUPLICATE_TOURNAMENT, payload: res.data});
        dispatch(setAlert("Tournament duplicated", "success"));
    } catch (err) {
        dispatch(setAlert(err.response.data.msg, "error"));
        dispatch({
            type: TOURNAMENTS_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status}
        });
    }
};

// Delete a tournament
export const deleteTournament = id => async dispatch => {
    try {
        dispatch({type: SET_TOURNAMENTS_LOADING});
        const res = await axios.delete(`/api/tournaments/${id}`);
        dispatch({type: DELETE_TOURNAMENT, payload: res.data});
        dispatch({type: CLEAR_SECTIONS, payload: res.data});
        dispatch(setAlert("Tournaments deleted", "success"));
    } catch (err) {
        dispatch(setAlert(err.response.data.msg, "error"));
        dispatch({
            type: TOURNAMENTS_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status}
        });
    }
};
