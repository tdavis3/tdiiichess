import React from 'react';

import {makeStyles} from '@material-ui/core/styles';
import {CssBaseline, Typography} from '@material-ui/core';


const useStyles = makeStyles(theme => ({
    root: {
        borderTop: '1px solid lightgray',
        marginTop: theme.spacing(3),
        padding: 15,
    },
}));

function Copyright() {
    return (
        <Typography variant="body2">
            {'© '}{new Date().getFullYear()}{' '} TDIII Chess
        </Typography>
    );
}

const Footer = () => {
    const classes = useStyles();

    return (
        <footer className={classes.root}>
            <CssBaseline/>
            <Copyright/>
        </footer>
    );
};

export default Footer;
