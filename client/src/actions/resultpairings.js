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
export const getResultPairings = (sectionid, roundnumber) => async dispatch => {
    try {
        const res = await axios.get(
            `/api/resultpairings/${sectionid}/${roundnumber}`
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
export const generatePairings = (sectionid, roundnumber, players_list) => async dispatch => {
    try {

        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        };

        const res = await axios.post(
            `/api/pairingalgo/${sectionid}/${roundnumber}`, {players_in_section: players_list}, config
        );

    } catch (err) {
        dispatch({
            type: PAIRING_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status}
        });
    }
};
