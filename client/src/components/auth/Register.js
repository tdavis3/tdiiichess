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
import {isValidEmail} from "../../utils/helpers";


const useStyles = makeStyles(theme => ({
    paper: {
        marginTop: theme.spacing(8),
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

const Register = ({setAlert, register, isAuthenticated}) => {
    const classes = useStyles();

    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        confirm_password: ""
    });

    const {first_name, last_name, email, password, confirm_password} = formData;

    const [errorData, setErrorData] = useState({
        passwords_match: true
    });

    const onChange = e => {
        setFormData({...formData, [e.target.id]: e.target.value});
        let newErrorData = {
            passwords_match: false
        };

        if (e.target.id === 'password') {
            newErrorData.passwords_match = (e.target.value === confirm_password);
        } else if (e.target.id === 'confirm_password') {
            newErrorData.passwords_match = (e.target.value === password);
        }
        setErrorData(newErrorData);
    }

    const onSubmit = async e => {
        e.preventDefault();
        if (password !== confirm_password) {
            setAlert("Passwords do not match", "error");
        } else {
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
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon/>
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign up
                </Typography>
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
                                required
                                fullWidth
                                id="first_name"
                                value={first_name}
                                onChange={e => onChange(e)}
                                label="First Name"
                                autoFocus
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                id="last_name"
                                value={last_name}
                                onChange={e => onChange(e)}
                                label="Last Name"
                                name="last_name"
                                autoComplete="lname"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                id="email"
                                value={email}
                                onChange={e => onChange(e)}
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                error={!isValidEmail(email) && email}
                                helperText={isValidEmail(email) || !email? "" : "Please enter a valid email address."}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                value={password}
                                onChange={e => onChange(e)}
                                autoComplete="current-password"
                                helperText="Must be 8-20 characters."
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                name="confirm_password"
                                label="Confirm Password"
                                type="password"
                                id="confirm_password"
                                value={confirm_password}
                                onChange={e => onChange(e)}
                                error={!errorData.passwords_match && confirm_password}
                                helperText={errorData.passwords_match || !confirm_password? "" : "Passwords do not match."}
                                autoComplete="current-password"
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
