import React, {useState} from "react";
import {Redirect} from "react-router-dom";

import {
    Avatar,
    Button,
    Container,
    TextField,
    Typography,
    Grid
} from '@material-ui/core';
import {makeStyles} from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';

import PropTypes from "prop-types";
import {connect} from "react-redux";
import {register} from "../../actions/auth";
import {setAlert} from "../../actions/alert";
import {allTruthy, isValidEmail} from "../../utils/helpers";
import Config from "../../config/default";
import Paper from "@material-ui/core/Paper";
import SnackbarAlert from "../layout/SnackbarAlert";


const useStyles = makeStyles(theme => ({
    paper: {
        marginTop: theme.spacing(8),
        padding: theme.spacing(3),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
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

const Register = ({setAlert, register, isAuthenticated}) => {
    const classes = useStyles();

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const {firstName, lastName, email, password, confirmPassword} = formData;

    const [errorData, setErrorData] = useState({
        display: false,
        validFirstName: false,
        validLastName: false,
        validEmail: false,
        passwordValidLength: false,
        passwordsMatch: true
    });

    const onChange = e => {
        setFormData({...formData, [e.target.id]: e.target.value});
    }

    const validateFields = () => {
        let newErrorData = {};
        newErrorData.validFirstName = (firstName !== "");
        newErrorData.validLastName = (lastName !== "");
        newErrorData.passwordValidLength = (password.length >= Config.validMinPasswordLength && password.length <= Config.validMaxPasswordLength);
        newErrorData.passwordsMatch = (password === confirmPassword && password !== "");
        newErrorData.validEmail = isValidEmail(email);
        if (!allTruthy(newErrorData)) {
            newErrorData.display = true;
            setErrorData(newErrorData);
            return false;
        }
        return true;
    };

    const onSubmit = async e => {
        e.preventDefault();
        if (validateFields()) {
            register({firstName, lastName, email, password});
        }
    };

    if (isAuthenticated) {
        return <Redirect to="/tournaments"/>;
    }

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline/>
            <SnackbarAlert/>
            <Paper>
                <div className={classes.paper}>
                    <div style={{display: 'contents'}}>
                        <Avatar className={classes.avatar}>
                            <LockOutlinedIcon/>
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Sign up
                        </Typography>
                    </div>
                    <div>
                        <form
                            className={classes.form}
                            onSubmit={e => onSubmit(e)}
                            noValidate
                        >
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        autoComplete="given-name"
                                        variant="outlined"
                                        fullWidth
                                        id="firstName"
                                        value={firstName}
                                        onChange={onChange}
                                        label="First name"
                                        size={"small"}
                                        error={!errorData.validFirstName && errorData.display}
                                        helperText={!errorData.validFirstName && errorData.display ? "Enter first name" : ""}
                                        autoFocus
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        autoComplete="family-name"
                                        variant="outlined"
                                        fullWidth
                                        id="lastName"
                                        value={lastName}
                                        onChange={onChange}
                                        label="Last name"
                                        size={"small"}
                                        error={!errorData.validLastName && errorData.display}
                                        helperText={!errorData.validLastName && errorData.display ? "Enter last name" : ""}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        autoComplete="email"
                                        variant="outlined"
                                        fullWidth
                                        id="email"
                                        value={email}
                                        onChange={onChange}
                                        label="Email address"
                                        size={"small"}
                                        error={!errorData.validEmail && errorData.display}
                                        helperText={!errorData.validEmail && errorData.display ? "Please enter a valid" +
                                            " email" : ""}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        autoComplete="new-password"
                                        variant="outlined"
                                        fullWidth
                                        label="Password"
                                        type="password"
                                        id="password"
                                        value={password}
                                        onChange={onChange}
                                        size={"small"}
                                        error={!errorData.passwordValidLength && errorData.display}
                                        helperText={"Must be 8-20 characters."}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        variant="outlined"
                                        fullWidth
                                        label="Confirm password"
                                        type="password"
                                        id="confirmPassword"
                                        value={confirmPassword}
                                        onChange={onChange}
                                        size={"small"}
                                        error={!errorData.passwordsMatch && errorData.display}
                                        helperText={!errorData.passwordsMatch && errorData.display ? "Passwords do not" +
                                            " match." : ""}
                                    />
                                </Grid>
                            </Grid>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                className={classes.submit}
                            >
                                Sign Up
                            </Button>
                        </form>
                    </div>
                </div>
            </Paper>
        </Container>
    );
};

Register.propTypes = {
    setAlert: PropTypes.func.isRequired,
    register: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, {setAlert, register})(Register);
