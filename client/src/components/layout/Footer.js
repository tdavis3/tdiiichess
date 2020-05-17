import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

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
        marginTop: theme.spacing(4),
        padding: theme.spacing(2, 2),
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
