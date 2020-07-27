import axios from "axios";

const setAuthToken = token => {
    if (token) {
        axios.defaults.headers.common["Authorization"] = token;
    } else {
        console.log("Deleted common token - weird");
        delete axios.defaults.headers.common["Authorization"];
    }
};

export default setAuthToken;
