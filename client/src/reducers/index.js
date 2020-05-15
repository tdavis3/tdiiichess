// Meeting place for all our reducers
import { combineReducers } from "redux";
import alert from "./alert";
import auth from "./auth";
import tournaments from "./tournaments";
import sections from "./sections";
import players from "./players";
import resultpairings from "./resultpairings";

export default combineReducers({
  alert,
  auth,
  tournaments,
  sections,
  players,
  resultpairings
});
