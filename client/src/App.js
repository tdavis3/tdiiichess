import React, {useEffect} from "react";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import PrivateRoute from "./components/routing/PrivateRoute";
import Login from "./components/auth/Login";
import Navbar from "./components/layout/Navbar";
import Landing from "./components/layout/Landing";
import Register from "./components/auth/Register";
import Tournaments from "./components/dashboard/Tournaments";
import Dashboard from "./components/dashboard/sections/Dashboard";
import Account from "./components/user/Account";
import AdminAnalytics from "./components/user/AdminAnalytics";
import Footer from "./components/layout/Footer";

// Redux
import {Provider} from "react-redux";
import store from "./store";
import {loadUser} from "./actions/auth";
import setAuthToken from "./utils/setAuthToken";

import "./App.css";
import {makeStyles} from "@material-ui/core/styles";

if (localStorage.token) {
    console.log("local storage filled");
    setAuthToken(localStorage.token);
}

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        minHeight: '100vh',
        flexDirection: 'column',
    },
    main: {
        flexGrow: 1
    }
}));

const App = () => {
    useEffect(() => {
        store.dispatch(loadUser());
    }, []); // Will only run once because of the second parameter is an empty array

    const classes = useStyles();

    return (
        <Provider store={store}>
            <Router>
                <div className={classes.root}>
                    <section className={classes.main}>
                        <Switch>
                            <Route exact path="/" component={Navbar}/>
                            <Route exact path="/register" component={Navbar}/>
                            <Route exact path="/login" component={Navbar}/>
                        </Switch>
                        <Route exact path="/" component={Landing}/>
                        <section>
                            <Switch>
                                <Route exact path="/register" component={Register}/>
                                <Route exact path="/login" component={Login}/>
                                <PrivateRoute exact path="/tournaments" component={Tournaments}/>
                                <PrivateRoute exact path="/tournaments/dashboard" component={Dashboard}/>
                                <PrivateRoute exact path="/account" component={Account}/>
                                <PrivateRoute exact path="/admin/analytics" component={AdminAnalytics}/>
                                <PrivateRoute exact path="/logout" component={Landing}/>
                            </Switch>
                        </section>
                    </section>
                    {/*<Footer/>*/}
                </div>
            </Router>
        </Provider>
    );
};

export default App;
