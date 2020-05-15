import React, {useState} from "react";
import {Redirect} from "react-router-dom";
import {connect} from "react-redux";
import {login} from "../../actions/auth";
import PropTypes from "prop-types";
import {makeStyles} from '@material-ui/core/styles';
import {
    Avatar,
    Button,
    Container,
    TextField,
    Typography
} from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import CssBaseline from "@material-ui/core/CssBaseline";

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

const Login = props => {
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
        props.login(email, password);
    };

    // Redirect if logged in
    if (props.isAuthenticated) {
        return <Redirect to="/tournaments"/>;
    }

    return (
        <Container component={"main"} maxWidth={"xs"}>
            <CssBaseline/>
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon/>
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign in
                </Typography>
                <form
                    className={classes.form}
                    onSubmit={e => onSubmit(e)}
                    noValidate
                >
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        value={email}
                        label="Email Address"
                        name="email"
                        onChange={e => onChange(e)}
                        autoComplete="email"
                        autoFocus
                    />

                    <TextField
                        variant="outlined"
                        margin="normal"
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
        </Container>
    );
};

Login.propTypes = {
    login: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool
};

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, {login})(Login);
