import axios from "axios";
import {setAlert} from "./alert";
import {
    GET_PLAYERS,
    CREATE_PLAYER,
    EDIT_PLAYER,
    DELETE_PLAYER,
    PLAYERS_ERROR
} from "./types";

// Get players in a specific section
export const getCurrentPlayers = sectionid => async dispatch => {
    try {
        const res = await axios.get(`/api/players/${sectionid}`);
        dispatch({type: GET_PLAYERS, payload: res.data});
    } catch (err) {
        dispatch({
            type: PLAYERS_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status}
        });
    }
};

// Create a player
export const createPlayer = (sectionid, formData) => async dispatch => {
    try {
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        };
        await axios.post(`/api/players/${sectionid}`, formData, config);
        const res = await axios.get(`/api/players/${sectionid}`);
        // No need to add to redux state directly just get all the players again??  Which one is faster / better??
        dispatch({type: GET_PLAYERS, payload: res.data});
        // dispatch({ type: CREATE_PLAYER, payload: res.data });
        dispatch(setAlert("Player Added", "success"));
    } catch (err) {
        dispatch({
            type: PLAYERS_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status}
        });
    }
};

// Edit a player
export const editPlayer = (playerid, formData) => async dispatch => {
    try {
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        };

        const res = await axios.put(`/api/players/${playerid}`, formData, config);

        dispatch({type: EDIT_PLAYER, payload: res.data});
        dispatch(setAlert("Player Edited", "success"));
    } catch (err) {
        const errors = err.response.data.errors;
        if (errors) {
            errors.forEach(error => dispatch(setAlert(error.msg, "error")));
        }
        dispatch({
            type: PLAYERS_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status}
        });
    }
};

// Delete a player
export const deletePlayer = data => async dispatch => {
    const players = data.objs;
    const parent_id = data.parent_id;
    if (players.length === 0) {
        dispatch(setAlert("No Player Selected", "error"));
        return;
    }
    if (window.confirm("Are you sure you want to delete the selected?")) {
        try {
            players.map(
                async playerobj => await axios.put(`/api/players/${parent_id}/${playerobj.playerid._id}`)
            );
            dispatch({type: DELETE_PLAYER, payload: players});
            dispatch(setAlert("Players Deleted", "success"));
        } catch (err) {
            dispatch({
                type: PLAYERS_ERROR,
                payload: {msg: err.response.statusText, status: err.response.status}
            });
        }
    }
};
