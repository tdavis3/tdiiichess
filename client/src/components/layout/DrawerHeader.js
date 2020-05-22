import React from 'react';
import {Link} from "react-router-dom";

import {makeStyles} from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import {CssBaseline, Menu, MenuItem, IconButton, Box, Grid, Typography} from "@material-ui/core";

import PropTypes from "prop-types";
import {connect} from "react-redux";
import {logout} from "../../actions/auth";


const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(1)
    },
    logo: {
        textAlign: 'center',
        fontSize: 25,
        marginBottom: 5
    },
    user: {
        fontSize: 14,
    },
    menu: {
        display: 'flex',
        alignItems: 'center'
    }
}));

const DrawerHeader = (props) => {
    const classes = useStyles();

    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <Box className={classes.root}>
            <CssBaseline/>
            <Typography className={classes.logo}>TDIII Chess</Typography>
            <Grid container spacing={3}>
                <Grid item xs={9}>
                    <Typography
                        className={classes.user} noWrap>{props.first_name} {props.last_name}</Typography>
                    <Typography className={classes.user} noWrap>{props.email}</Typography>
                </Grid>
                <Grid item xs={3} className={classes.menu}>
                    <IconButton
                        aria-label={"Profile"}
                        aria-controls={"profile-menu"}
                        aria-haspopup={"true"}
                        onClick={handleClick}
                    >
                        <MenuIcon/>
                    </IconButton>
                    <Menu
                        id="profile-menu"
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                    >
                        <MenuItem onClick={handleClose}>Profile</MenuItem>
                        <MenuItem component={Link} to={'/account'} onClick={handleClose}>My account</MenuItem>
                        <MenuItem onClick={props.logout}>Logout</MenuItem>
                    </Menu>
                </Grid>
            </Grid>
        </Box>
    );
};


DrawerHeader.propTypes = {
    logout: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps, {logout})(DrawerHeader);
