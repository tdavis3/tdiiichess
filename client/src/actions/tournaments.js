import axios from "axios";
import {setAlert} from "./alert";
import {
    GET_TOURNAMENTS,
    CREATE_TOURNAMENT,
    EDIT_TOURNAMENT,
    DELETE_TOURNAMENT,
    TOURNAMENTS_ERROR
} from "./types";

// Get current users tournaments
export const getCurrentTournaments = () => async dispatch => {
    try {
        const res = await axios.get("/api/tournaments");
        console.log(res);
        console.log("Tyrone here");
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

        console.log('Tyrone');
        console.log(formData);

        const res = await axios.post("/api/tournaments", formData, config);

        dispatch({type: CREATE_TOURNAMENT, payload: res.data});

        dispatch(setAlert("Tournament Created", "success"));
    } catch (err) {
        const errors = err.response.data.errors;
        if (errors) {
            errors.forEach(error => dispatch(setAlert(error.msg, "error")));
        }
        dispatch({
            type: TOURNAMENTS_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status}
        });
    }
};

// Edit Tournament
export const editTournament = (tournament_id, formData) => async dispatch => {
    try {
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        };

        const res = await axios.put(
            `/api/tournaments/${tournament_id}`,
            formData,
            config
        );

        dispatch({type: EDIT_TOURNAMENT, payload: res.data});

        dispatch(setAlert("Tournament Edited", "success"));
    } catch (err) {
        const errors = err.response.data.errors;
        if (errors) {
            errors.forEach(error => dispatch(setAlert(error.msg, "error")));
        }
        dispatch({
            type: TOURNAMENTS_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status}
        });
    }
};

// Delete a tournament
export const deleteTournament = data => async dispatch => {
    const tournaments = data.objs;
    if (tournaments.length === 0) {
        dispatch(setAlert("No Tournament Selected", "error"));
        return;
    }
    if (window.confirm("Are you sure you want to delete the selected?")) {
        try {
            tournaments.map(async tournamentobj => await axios.delete(`/api/tournaments/${tournamentobj._id}`));
            dispatch({type: DELETE_TOURNAMENT, payload: tournaments});
            dispatch(setAlert("Tournaments Deleted", "success"));
        } catch (err) {
            dispatch({
                type: TOURNAMENTS_ERROR,
                payload: {msg: err.response.statusText, status: err.response.status}
            });
        }
    }
};
