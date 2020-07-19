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
        // const res = await axios.get("/api/tournaments");
        const res = await axios.get("https://api.tdiiichess.com/users/1234/tournaments");
        dispatch({type: GET_TOURNAMENTS, payload: res.data});
    } catch (err) {
        dispatch({
            type: TOURNAMENTS_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status}
        });
    }
};

// Create new Tournament
export const createTournament = tournament => async dispatch => {
    try {
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        };
        dispatch({type: SET_TOURNAMENTS_LOADING});
        const res = await axios.post("https://api.tdiiichess.com/users/1234/tournaments", tournament, config);
        dispatch({type: CREATE_TOURNAMENT, payload: {...tournament, PK: res.data.PK, SK: res.data.SK}});
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
export const editTournament = (userId, tournamentId, tournament) => async dispatch => {
    try {
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        };
        dispatch({type: SET_TOURNAMENTS_LOADING});
        await axios.put(
            `https://api.tdiiichess.com/users/${userId}/tournaments/${tournamentId}`,
            tournament,
            config
        );
        dispatch({type: EDIT_TOURNAMENT, payload: tournament});
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
        const res = await axios.post(`https//api.tdiiichess.com/tournaments/${tournamentId}/duplicate`, {}, config);
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
export const deleteTournament = (userId, tournamentId) => async dispatch => {
    try {
        dispatch({type: SET_TOURNAMENTS_LOADING});
        // const res = await axios.delete(`/api/tournaments/${id}`);
        const res = await axios.delete(
            `https://api.tdiiichess.com/users/${userId}/tournaments/${tournamentId}`);
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
