import axios from "axios";
import {setAlert} from "./alert";
import {
    GET_PLAYERS,
    EDIT_PLAYER,
    MOVE_PLAYER,
    DELETE_PLAYER,
    PLAYERS_ERROR,
    SET_PLAYERS_LOADING,
    PLAYERS_SUCCESS,
    CREATE_PLAYER,
    STOP_PLAYERS_LOADING,
    CLEAR_PLAYERS,
    SET_USCF_SCRAPER_LOADING,
    USCF_SCRAPER_SUCCESS,
    CLEAR_SCRAPER
} from "./types";
import {stripPrefix} from "../utils/helpers";

// Get players in a specific section
export const getPlayers = (tournamentId, sectionId) => async dispatch => {
    try {
        dispatch({type: SET_PLAYERS_LOADING});
        const res = await axios.get(`https://api.tdiiichess.com/tournaments/${stripPrefix(tournamentId)}/sections/${stripPrefix(sectionId)}/players`);
        dispatch({type: GET_PLAYERS, payload: {sectionId: sectionId, players: res.data}});
    } catch (err) {
        console.log(err);
        dispatch({
            type: PLAYERS_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status}
        });
    }
};

// Create a player
export const createPlayer = (tournamentId, sectionId, player) => async dispatch => {
    try {
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        };
        dispatch({type: SET_PLAYERS_LOADING});
        const res = await axios.post(`https://api.tdiiichess.com/tournaments/${stripPrefix(tournamentId)}/sections/${stripPrefix(sectionId)}/players`, player, config);
        dispatch({type: CREATE_PLAYER, payload: {sectionId, player: {...player, PK: res.data.PK, SK: res.data.SK}}});
        dispatch({type: PLAYERS_SUCCESS});
        dispatch(setAlert("Player added", "success"));
    } catch (err) {
        console.log(err);
        dispatch(setAlert(err.response.data.msg, "error"));
        dispatch({
            type: PLAYERS_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status}
        });
    }
};

// Edit a player
export const editPlayer = (playerId, player) => async dispatch => {
    try {
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        };
        await axios.put(`https://api.tdiiichess.com/players/${stripPrefix(playerId)}`, player, config);
        dispatch({type: EDIT_PLAYER, payload: player});
        dispatch(setAlert("Player edited", "success"));
    } catch (err) {
        console.log(err);
        dispatch(setAlert(err.response.data.msg, "error"));
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
        dispatch({type: SET_PLAYERS_LOADING});
        const res = await axios.put(`/api/players/move/${oldSectionId}/${newSectionId}`, {movingPlayerObj}, config);
        dispatch({type: MOVE_PLAYER, payload: res.data});
        dispatch(setAlert(res.data.msg, "success"));
    } catch (err) {
        console.log(err);
        dispatch(setAlert(err.response.data.msg, "error"));
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
            dispatch(setAlert(true, "Players deleted", "success"));
        } catch (err) {
            console.log(err);
            dispatch({
                type: PLAYERS_ERROR,
                payload: {msg: err.response.statusText, status: err.response.status}
            });
        }
    }
};

// Clear sections in state
export const clearPlayers = () => async dispatch => {
    dispatch({type: CLEAR_PLAYERS});
};

export const stopPlayersLoading = () => async dispatch => {
    dispatch({type: STOP_PLAYERS_LOADING});
};

// USCF player scraper
export const scrapePlayerInfo = (scrapeData) => async dispatch => {
    try {
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        };
        dispatch({type: SET_USCF_SCRAPER_LOADING});
        const res = await axios.post(`https://api.tdiiichess.com/uscfScraper`, scrapeData, config);
        if (Array.isArray(res.data)) {
            dispatch({type: USCF_SCRAPER_SUCCESS, payload: res.data});
        } else {
            dispatch({type: USCF_SCRAPER_SUCCESS, payload: [res.data]});
        }
    } catch (err) {
        console.log(err);
    }
};

// Clear scraped players in state
export const clearScrapedPlayers = () => async dispatch => {
    dispatch({type: CLEAR_SCRAPER});
};
