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


const useStyles = makeStyles(theme => ({
    paper: {
        marginTop: theme.spacing(8),
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
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const {first_name, last_name, email, password, confirmPassword} = formData;

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
        newErrorData.validFirstName = (first_name !== "");
        newErrorData.validLastName = (last_name !== "");
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
            register({first_name, last_name, email, password});
        }
    };

    if (isAuthenticated) {
        return <Redirect to="/tournaments"/>;
    }

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline/>
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
                                    autoComplete="fname"
                                    name="first_name"
                                    variant="outlined"
                                    fullWidth
                                    id="first_name"
                                    value={first_name}
                                    onChange={e => onChange(e)}
                                    label="First name"
                                    size={"small"}
                                    error={!errorData.validFirstName && errorData.display}
                                    helperText={!errorData.validFirstName && errorData.display ? "Enter first name" : ""}
                                    autoFocus
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    variant="outlined"
                                    fullWidth
                                    id="last_name"
                                    value={last_name}
                                    onChange={e => onChange(e)}
                                    label="Last name"
                                    name="last_name"
                                    autoComplete="lname"
                                    size={"small"}
                                    error={!errorData.validLastName && errorData.display}
                                    helperText={!errorData.validLastName && errorData.display ? "Enter last name" : ""}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    fullWidth
                                    id="email"
                                    value={email}
                                    onChange={e => onChange(e)}
                                    label="Email address"
                                    name="email"
                                    autoComplete="email"
                                    size={"small"}
                                    error={!errorData.validEmail && errorData.display}
                                    helperText={!errorData.validEmail && errorData.display ? "Please enter a valid" +
                                        " email" : ""}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    variant="outlined"
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={e => onChange(e)}
                                    autoComplete="current-password"
                                    size={"small"}
                                    error={!errorData.passwordValidLength && errorData.display}
                                    helperText={"Must be 8-20 characters."}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    variant="outlined"
                                    fullWidth
                                    name="confirm_password"
                                    label="Confirm password"
                                    type="password"
                                    id="confirmPassword"
                                    value={confirmPassword}
                                    onChange={e => onChange(e)}
                                    autoComplete="current-password"
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
