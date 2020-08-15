import axios from "axios";
// import {setAlert} from "./alert";
import {
    // GENERATE_PAIRINGS,
    GET_PAIRINGS,
    // DELETE_PAIRING,
    // UPDATE_RESULT,
    PAIRING_ERROR
} from "./types";
import {stripPrefix} from "../utils/helpers";


// Generate pairings
export const generatePairings = (tournamentId, sectionId, roundNumber) => async dispatch => {
    try {
        const config = {
            headers: {
                "Content-Type": "application/json",
                // "x-api-key": "aAKtFfQ3mg3v0Xq1Ynlhr8peqen6fRZ19rk4TmAh"
            }
        };
        const res = await axios.get(`https://api.tdiiichess.com/pairingEngine/${stripPrefix(tournamentId)}/${stripPrefix(sectionId)}/${roundNumber}`);
        console.log("Pairings generated result: ", res.data);
    } catch (err) {
        dispatch({
            type: PAIRING_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status}
        });
    }
};
