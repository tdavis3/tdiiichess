import axios from "axios";
import {setAlert} from "./alert";
import {
    GET_PLAYERS,
    EDIT_PLAYER,
    MOVE_PLAYER,
    DELETE_PLAYER,
    PLAYERS_ERROR,
    EDIT_SECTION
} from "./types";

// Get players in a specific section
export const getCurrentPlayers = section_id => async dispatch => {
    try {
        const res = await axios.get(`/api/players/${section_id}`);
        dispatch({type: GET_PLAYERS, payload: res.data});
    } catch (err) {
        dispatch({
            type: PLAYERS_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status}
        });
    }
};

// Create a player
export const createPlayer = (section_id, formData) => async dispatch => {
    try {
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        };
        const res = await axios.post(`/api/players/${section_id}`, formData, config);
        dispatch({type: EDIT_SECTION, payload: res.data});
        dispatch(setAlert("Player Added", "success"));
    } catch (err) {
        dispatch({
            type: PLAYERS_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status}
        });
    }
};

// Edit a player
export const editPlayer = (player_id, formData) => async dispatch => {
    try {
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        };

        const res = await axios.put(`/api/players/${player_id}`, formData, config);

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

// Move a player to another section
export const movePlayer = (oldSectionId, movingPlayerObj, newSectionId) => async dispatch => {
    try {
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        };
        const res = await axios.put(`/api/players/move/${oldSectionId}/${newSectionId}`, {movingPlayerObj}, config);
        dispatch({type: MOVE_PLAYER, payload: res.data});
        dispatch(setAlert(true, "Player moved", "success"));
    } catch (err) {
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
                async playerobj => await axios.put(`/api/players/${parent_id}/${playerobj.player_id._id}`)
            );
            dispatch({type: DELETE_PLAYER, payload: players});
            dispatch(setAlert(true, "Players Deleted", "success"));
        } catch (err) {
            dispatch({
                type: PLAYERS_ERROR,
                payload: {msg: err.response.statusText, status: err.response.status}
            });
        }
    }
};
