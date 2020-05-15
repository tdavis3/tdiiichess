import React from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Drawer from "@material-ui/core/Drawer";
import CssBaseline from "@material-ui/core/CssBaseline";
import makeStyles from "@material-ui/core/styles/makeStyles";

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

const Account = props => {
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
                <h1>Hi {props.auth.isAuthenticated ? props.auth.user.firstname : null} </h1>
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
