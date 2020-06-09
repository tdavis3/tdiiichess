import axios from "axios";
import {setAlert} from "./alert";
import {
    GET_TOURNAMENTS,
    CREATE_TOURNAMENT,
    EDIT_TOURNAMENT,
    DELETE_TOURNAMENT,
    TOURNAMENTS_ERROR, CLEAR_SECTIONS
} from "./types";

// Get current users tournaments
export const getCurrentTournaments = () => async dispatch => {
    try {
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
        const res = await axios.post("/api/tournaments", formData, config);
        dispatch({type: CREATE_TOURNAMENT, payload: res.data});
        dispatch(setAlert("Tournament created", "success"));
    } catch (err) {
        dispatch(setAlert(err.response.data.msg, "error"));
        // dispatch({
        //     type: TOURNAMENTS_ERROR,
        //     payload: {msg: err.response.statusText, status: err.response.status}
        // });
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

// Delete a tournament
export const deleteTournament = id => async dispatch => {
    try {
        await axios.delete(`/api/tournaments/${id}`);
        dispatch({type: DELETE_TOURNAMENT, payload: id});
        dispatch({type: CLEAR_SECTIONS, payload: id});
        dispatch(setAlert("Tournaments deleted", "success"));
    } catch (err) {
        dispatch(setAlert(err.response.data.msg, "error"));
        // dispatch({
        //     type: TOURNAMENTS_ERROR,
        //     payload: {msg: err.response.statusText, status: err.response.status}
        // });
    }
};
