import axios from "axios";
import {setAlert} from "./alert";
import {
    GENERATE_PAIRINGS,
    GET_PAIRINGS,
    DELETE_PAIRING,
    UPDATE_RESULT,
    PAIRING_ERROR
} from "./types";


// Get pairings for a round
export const getResultPairings = (section_id, round_number) => async dispatch => {
    try {
        const res = await axios.get(
            `/api/resultpairings/${section_id}/${round_number}`
        );
        dispatch({type: GET_PAIRINGS, payload: res.data});
    } catch (err) {
        dispatch({
            type: PAIRING_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status}
        });
    }
};

// Generate pairings
export const generatePairings = (section_id, round_number, players_list) => async dispatch => {
    try {

        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        };

        const res = await axios.post(
            `/api/pairingalgo/${section_id}/${round_number}`, {players_in_section: players_list}, config
        );

    } catch (err) {
        dispatch({
            type: PAIRING_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status}
        });
    }
};
