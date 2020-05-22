// Meeting place for all our reducers
import {combineReducers} from "redux";
import alert from "./alert";
import auth from "./auth";
import players from "./players";
import resultpairings from "./resultpairings";
import sections from "./sections";
import tournaments from "./tournaments";

const appReducer = combineReducers({
        alert,
        auth,
        players,
        resultpairings,
        sections,
        tournaments
    }
);

export default function (state, action) {
    if (action.type === 'LOGOUT') {
        const {routing} = state;
        state = {routing};
    }
    return appReducer(state, action);
};

// export default combineReducers(
//     alert,
//     auth,
//     players,
//     resultpairings,
//     sections,
//     tournaments
// );