import axios from "axios";
import {setAlert} from "./alert";
import {
    GET_SECTIONS,
    CREATE_SECTION,
    EDIT_SECTION,
    DUPLICATE_SECTION,
    MOVE_SECTION,
    DELETE_SECTION,
    CLEAR_SECTIONS,
    SECTIONS_ERROR,
    SET_SECTIONS_LOADING,
    PLAYERS_SUCCESS,
    STOP_SECTIONS_LOADING
} from "./types";
import {stripPrefix} from "../utils/helpers";


// Get sections
export const getSections = tournamentId => async dispatch => {
    try {
        dispatch({type: SET_SECTIONS_LOADING});
        const res = await axios.get(`https://api.tdiiichess.com/tournaments/${stripPrefix(tournamentId)}/sections`);
        dispatch({type: GET_SECTIONS, payload: res.data});
        if (res.data.length === 0) {
            return undefined;
        }
        return stripPrefix(res.data[0].SK);
    } catch (err) {
        dispatch(setAlert(err.response.data.msg, "error"));
        dispatch({
            type: SECTIONS_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status}
        });
    }
};

// Create a section
export const createSection = (tournamentId, section) => async dispatch => {
    try {
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        };
        dispatch({type: SET_SECTIONS_LOADING});
        const res = await axios.post(
            `https://api.tdiiichess.com/tournaments/${stripPrefix(tournamentId)}/sections`,
            section,
            config
        );
        dispatch({type: CREATE_SECTION, payload: {...section, currentRound: 0, PK: res.data.PK, SK: res.data.SK}});
        dispatch(setAlert("Section created", "success"));
    } catch (err) {
        dispatch(setAlert(err.response.data.msg, "error"));
        dispatch({
            type: SECTIONS_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status}
        });
    }
};

// Edit a section
export const editSection = (sectionId, sectionFields) => async dispatch => {
    try {
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        };
        dispatch({type: SET_SECTIONS_LOADING});
        await axios.put(`https://api.tdiiichess.com/sections/${stripPrefix(sectionId)}`, sectionFields, config);
        dispatch({type: EDIT_SECTION, payload: sectionFields});
        dispatch(setAlert("Section edited", "success"));
    } catch (err) {
        dispatch(setAlert(err.response.data.msg, "error"));
        dispatch({
            type: SECTIONS_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status}
        });
    }
};

// Duplicate a section
export const duplicateSection = (sectionId, section) => async dispatch => {
    try {
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        };
        dispatch({type: SET_SECTIONS_LOADING});
        const res = await axios.post(`https://api.tdiiichess.com/sections/${stripPrefix(sectionId)}`, {}, config);
        dispatch({type: DUPLICATE_SECTION, payload: {...section, PK: res.data.PK, SK: res.data.SK}});
        dispatch(setAlert("Section duplicated", "success"));
    } catch (err) {
        dispatch(setAlert(err.response.data.msg, "error"));
        dispatch({
            type: SECTIONS_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status}
        });
    }
};

// Move a section
export const moveSection = (sectionId, destinationTournamentId) => async dispatch => {
    try {
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        };
        dispatch({type: SET_SECTIONS_LOADING});
        await axios.post(`https://api.tdiiichess.com/sections/${stripPrefix(sectionId)}/tournaments/${stripPrefix(destinationTournamentId)}`, {}, config);
        dispatch({type: MOVE_SECTION, payload: sectionId});
        dispatch(setAlert("Section moved", "success"));
    } catch (err) {
        dispatch(setAlert(err.response.data.msg, "error"));
        dispatch({
            type: SECTIONS_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status}
        });
    }
};

// Delete a section
export const deleteSection = sectionId => async dispatch => {
    try {
        dispatch({type: SET_SECTIONS_LOADING});
        await axios.delete(`https://api.tdiiichess.com/sections/${stripPrefix(sectionId)}`);
        dispatch({type: DELETE_SECTION, payload: sectionId});
        dispatch(setAlert("Section deleted", "success"));
    } catch (err) {
        dispatch(setAlert(err.response.data.msg, "error"));
        dispatch({
            type: SECTIONS_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status}
        });
    }
};

// Clear sections in state
export const clearSections = () => async dispatch => {
    dispatch({type: CLEAR_SECTIONS});
};

export const stopSectionsLoading = () => async dispatch => {
    dispatch({type: STOP_SECTIONS_LOADING});
};
