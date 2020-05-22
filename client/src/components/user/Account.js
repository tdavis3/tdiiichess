import React from "react";

import makeStyles from "@material-ui/core/styles/makeStyles";
import {CssBaseline, Drawer, Divider, List, ListItem, ListItemText} from '@material-ui/core';

import PropTypes from "prop-types";
import {connect} from "react-redux";

const drawerWidth = 220;

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
    },
    appBar: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    // necessary for content to be below app bar
    toolbar: theme.mixins.toolbar,
    content: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.default,
        padding: theme.spacing(3),
    },
}));

const Account = ({auth}) => {
    const classes = useStyles();
    return (
        <div className={classes.root}>
            <CssBaseline/>
            <Drawer
                className={classes.drawer}
                variant="permanent"
                classes={{
                    paper: classes.drawerPaper,
                }}
                anchor="left"
            >
                <div className={classes.toolbar}/>
                <Divider/>
                <List>
                    <ListItem button>
                        <ListItemText primary={"Tournaments"}/>
                    </ListItem>
                </List>
                <Divider/>
            </Drawer>
            <main className={classes.content}>
                <h1>Hi {auth.isAuthenticated ? auth.user.firstname : null} </h1>
            </main>
        </div>
    );
};

Account.propTypes = {
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps)(Account);
