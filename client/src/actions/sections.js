import axios from "axios";
import {setAlert} from "./alert";
import {
    GET_SECTIONS,
    CREATE_SECTION,
    EDIT_SECTION,
    DELETE_SECTION,
    CLEAR_SECTIONS,
    SECTIONS_ERROR,
} from "./types";

// Get sections
export const getSections = id => async dispatch => {
    try {
        const res = await axios.get(`/api/sections/${id}`);
        dispatch({type: GET_SECTIONS, payload: res.data});
    } catch (err) {
        dispatch(setAlert(err.response.data.msg, "error"));
        dispatch({
            type: SECTIONS_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status}
        });
    }
};

// Create a section
export const createSection = (tournament_id, formData) => async dispatch => {
    try {
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        };
        const res = await axios.post(
            `/api/sections/${tournament_id}`,
            formData,
            config
        );
        dispatch({type: CREATE_SECTION, payload: res.data});
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
export const editSection = (section_id, formData) => async dispatch => {
    try {
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        };
        const res = await axios.put(`/api/sections/${section_id}`, formData, config);
        dispatch({type: EDIT_SECTION, payload: res.data});
        dispatch(setAlert("Section edited", "success"));
    } catch (err) {
        dispatch(setAlert(err.response.data.msg, "error"));
        dispatch({
            type: SECTIONS_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status}
        });
    }
};

// Delete a section
export const deleteSection = id => async dispatch => {
    try {
        await axios.delete(`/api/sections/${id}`);
        dispatch({type: DELETE_SECTION, payload: id});
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
