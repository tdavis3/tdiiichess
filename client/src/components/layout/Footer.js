import React from 'react';

import {makeStyles} from '@material-ui/core/styles';
import {CssBaseline, Container, Typography} from '@material-ui/core';

function Copyright() {
    return (
        <Typography variant="body2">
            {'© '}
            {new Date().getFullYear()}
            {' '} TDIII Chess
        </Typography>
    );
}

const useStyles = makeStyles(theme => ({
    root: {
        borderTop: '1px solid lightgray',
        marginTop: theme.spacing(3),
        padding: 15,
    },
}));


const Footer = () => {
    const classes = useStyles();

    return (
        <footer className={classes.root}>
            <CssBaseline/>
            <Container maxWidth="sm">
                <Copyright/>
            </Container>
        </footer>
    );
};

export default Footer;
