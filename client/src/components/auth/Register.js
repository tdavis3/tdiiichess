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
        confirmpassword: ""
    });

    const {first_name, last_name, email, password, confirmpassword} = formData;

    const onChange = e =>
        setFormData({...formData, [e.target.id]: e.target.value});

    const onSubmit = async e => {
        e.preventDefault();
        if (password !== confirmpassword) {
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
                            />
                            <small id="passwordHelpBlock" className="form-text text-muted">
                                Your password must be 8-20 characters long.
                            </small>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                name="confirmpassword"
                                label="Confirm Password"
                                type="password"
                                id="confirmpassword"
                                value={confirmpassword}
                                onChange={e => onChange(e)}
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
