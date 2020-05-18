import React, {useEffect} from "react";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Landing from "./components/layout/Landing";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import SimpleAlert from "./components/layout/SimpleAlert";
import Tournaments from "./components/dashboard/Tournaments";
import Sections from "./components/dashboard/Sections";
import PrivateRoute from "./components/routing/PrivateRoute";
import Account from "./components/user/Account";
import SectionDash from "./components/dashboard/SectionDash";
import ResultPairings from "./components/dashboard/ResultPairings";
import Standings from "./components/dashboard/Standings";
import Footer from "./components/layout/Footer";

// Redux
import {Provider} from "react-redux";
import store from "./store";
import {loadUser} from "./actions/auth";
import setAuthToken from "./utils/setAuthToken";

import "./App.css";
import {makeStyles} from "@material-ui/core/styles";
import NavbarPrivate from "./components/layout/NavbarPrivate";

if (localStorage.token) {
    setAuthToken(localStorage.token);
}

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        minHeight: '100vh',
        flexDirection: 'column',
    },
    main: {
        // flex: '1 0 auto',
        flexGrow: 1,
        // width: '100%'
    }
}));

const App = () => {
    // A hook - learn more about
    useEffect(() => {
        store.dispatch(loadUser());
    }, []); // Will only run once because of the second parameter

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
                            {/*<PrivateRoute exact path="/tournaments" component={NavbarPrivate}/>*/}
                            {/*<PrivateRoute exact path="/account" component={NavbarPrivate}/>*/}
                        </Switch>
                        <Route exact path="/" component={Landing}/>
                        <section>
                            <SimpleAlert/>
                            <Switch>
                                <Route exact path="/register" component={Register}/>
                                <Route exact path="/login" component={Login}/>
                                <PrivateRoute exact path="/tournaments" component={Tournaments}/>
                                <PrivateRoute
                                    exact
                                    path="/tournaments/sections"
                                    component={Sections}
                                />
                                <PrivateRoute
                                    exact
                                    path="/tournaments/sections/dashboard"
                                    component={SectionDash}
                                />
                                <PrivateRoute
                                    exact
                                    path="/tournaments/sections/resultpairings"
                                    component={ResultPairings}
                                />
                                <PrivateRoute
                                    exact
                                    path="/tournaments/sections/standings"
                                    component={Standings}
                                />
                                <PrivateRoute exact path="/account" component={Account}/>
                                <PrivateRoute exact path="/logout" component={Landing}/>
                            </Switch>
                        </section>
                    </section>
                    <Footer/>
                </div>
            </Router>
        </Provider>
    );
};

export default App;
