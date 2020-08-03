import React, {useState} from "react";
import {Redirect, useHistory} from "react-router-dom";

import {
    Avatar,
    Button,
    Container,
    TextField,
    Typography
} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import CssBaseline from "@material-ui/core/CssBaseline";
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';

import PropTypes from "prop-types";
import {connect} from "react-redux";
import {login} from "../../actions/auth";
import SnackbarAlert from "../layout/SnackbarAlert";
import Paper from "@material-ui/core/Paper";


const useStyles = makeStyles(theme => ({
    paper: {
        marginTop: theme.spacing(8),
        padding: theme.spacing(3),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));


const Login = ({auth, login}) => {

    let history = useHistory();

    const classes = useStyles();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const {email, password} = formData;

    const onChange = e =>
        setFormData({...formData, [e.target.id]: e.target.value});

    const onSubmit = async e => {
        e.preventDefault();
        login(email, password);
    };

    // Redirect if logged in
    if (auth.isAuthenticated) {
        // return <Redirect to="/tournaments"/>;
        history.push('/tournaments');
    }

    return (
        <Container component={"main"} maxWidth={"xs"}>
            <CssBaseline/>
            <SnackbarAlert/>
            <Paper>
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <LockOutlinedIcon/>
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign in
                    </Typography>
                    <form
                        className={classes.form}
                        onSubmit={onSubmit}
                        noValidate
                    >
                        <TextField
                            autoComplete="email"
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            id="email"
                            value={email}
                            label="Email Address"
                            onChange={onChange}
                            autoFocus
                        />

                        <TextField
                            autoComplete="current-password"
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            value={password}
                            onChange={onChange}
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                        >
                            Login
                        </Button>
                    </form>
                </div>
            </Paper>
        </Container>
    );
};

Login.propTypes = {
    login: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps, {login})(Login);
