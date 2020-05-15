import axios from "axios";
import {setAlert} from "./alert";
import {
    GET_SECTIONS,
    CREATE_SECTION,
    EDIT_SECTION,
    SECTIONS_ERROR,
    DELETE_SECTION
} from "./types";

// Get sections
export const getCurrentSections = id => async dispatch => {
    try {
        const res = await axios.get(`/api/sections/${id}`);
        dispatch({type: GET_SECTIONS, payload: res.data});
    } catch (err) {
        dispatch({
            type: SECTIONS_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status}
        });
    }
};

// Create a section
export const createSection = (tournamentid, formData) => async dispatch => {
    try {
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        };

        const res = await axios.post(
            `/api/sections/${tournamentid}`,
            formData,
            config
        );

        dispatch({type: CREATE_SECTION, payload: res.data});

        dispatch(setAlert("Section Created", "success"));
    } catch (err) {
        console.log(err.response);
        const errors = err.response.data.errors;
        if (errors) {
            errors.forEach(error => dispatch(setAlert(error.msg, "error")));
        }
        dispatch({
            type: SECTIONS_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status}
        });
    }
};

// Edit a section
export const editSection = (sectionid, formData) => async dispatch => {
    try {
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        };

        const res = await axios.put(`/api/sections/${sectionid}`, formData, config);

        dispatch({type: EDIT_SECTION, payload: res.data});

        dispatch(setAlert("Section Edited", "success"));
    } catch (err) {
        const errors = err.response.data.errors;
        if (errors) {
            errors.forEach(error => dispatch(setAlert(error.msg, "error")));
        }
        dispatch({
            type: SECTIONS_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status}
        });
    }
};

// Delete a section
export const deleteSection = data => async dispatch => {
    const sections = data.objs;
    if (sections.length === 0) {
        dispatch(setAlert("No Section Selected", "error"));
        return;
    }
    if (window.confirm("Are you sure you want to delete the selected?")) {
        try {
            sections.map(
                async sectionobj => await axios.delete(`/api/sections/${sectionobj._id}`)
            );
            dispatch({type: DELETE_SECTION, payload: sections});
            dispatch(setAlert("Sections Deleted", "success"));
        } catch (err) {
            dispatch({
                type: SECTIONS_ERROR,
                payload: {msg: err.response.statusText, status: err.response.status}
            });
        }
    }
};
