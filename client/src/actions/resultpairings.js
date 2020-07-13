import axios from "axios";
// import {setAlert} from "./alert";
import {
    // GENERATE_PAIRINGS,
    GET_PAIRINGS,
    // DELETE_PAIRING,
    // UPDATE_RESULT,
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
export const generatePairings = (sectionId, roundNumber, playersArray) => async dispatch => {
    try {

        const config = {
            headers: {
                "Content-Type": "application/json",
                // "x-api-key": "aAKtFfQ3mg3v0Xq1Ynlhr8peqen6fRZ19rk4TmAh"
            }
        };

        const res = await axios.post(
            `https://api.tdiiichess.com/pairingEngine?sectionId=${sectionId}&round=${roundNumber}`, JSON.stringify({players: playersArray}), config
        );

        console.log(res);

    } catch (err) {
        dispatch({
            type: PAIRING_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status}
        });
    }
};
