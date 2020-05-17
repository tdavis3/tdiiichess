import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/core/styles';
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {Box} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import MenuIcon from '@material-ui/icons/Menu';

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(1),
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

    return (
        <Box className={classes.root}>
            <CssBaseline/>
            <Typography className={classes.logo}>TDIII Chess</Typography>
            <Grid container spacing={3}>
                <Grid item xs={9}>
                    <Typography
                        className={classes.user}>{props.first_name} {props.last_name}</Typography>
                    <Typography className={classes.user}>{props.email}</Typography>
                </Grid>
                <Grid item xs={3} className={classes.menu}>
                    <MenuIcon/>
                </Grid>
            </Grid>
        </Box>
    );
};


DrawerHeader.propTypes = {};

const mapStateToProps = state => ({});

export default DrawerHeader;
