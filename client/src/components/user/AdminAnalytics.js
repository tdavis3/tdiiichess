import React, {useEffect} from "react";
import {Link} from "react-router-dom";

import makeStyles from "@material-ui/core/styles/makeStyles";
import {
    CssBaseline,
    Chip,
    Drawer,
    Divider,
    Box,
    Typography,
    Container,
    List,
    ListItem,
    ListItemText
} from '@material-ui/core';

import Spinner from "../layout/Spinner";
import DrawerHeader from "../layout/DrawerHeader";

import PropTypes from "prop-types";
import {connect} from "react-redux";
import {get_admin_analytics} from "../../actions/account";


const drawerWidth = 260;

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
    },
    drawer: {
        display: "inline-block",
        width: drawerWidth,
        flexShrink: 0
    },
    drawerPaper: {
        width: drawerWidth,
    },
    drawerContainer: {
        overflow: 'auto',
    },
    toolbar: theme.mixins.toolbar,
    logo: {
        width: '60px',
    },
    center: {
        textAlign: 'center',
        fontSize: 18
    },
    box: {
        padding: theme.spacing(1)
    },
    content: {
        flexGrow: 1,
        height: '100vh',
        overflow: 'auto',
    },
    container: {
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4),
    },
    profile: {
        marginLeft: 100
    },
    gridVerticalCenter: {
        display: "flex",
        alignItems: "center"
    }
}));


const AdminAnalytics = ({auth, account, get_admin_analytics}) => {
    const classes = useStyles();

    useEffect(
        () => {
            // const interval = setInterval(() => {
            //     get_admin_analytics(auth.user._id);
            // }, 1000);
            // return () => clearInterval(interval);
            get_admin_analytics(auth.user._id);
        }, []);

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
                <DrawerHeader
                    first_name={auth.user.first_name}
                    last_name={auth.user.last_name}
                    email={auth.user.email}
                />
                <Divider/>
                <Box className={classes.box}>
                    <Typography className={classes.center}>Menu</Typography>
                </Box>
                <List>
                    <ListItem button component={Link} to={'/tournaments'}>
                        <ListItemText primary="Tournaments"/>
                    </ListItem>
                    {auth.user.admin ? (
                        <ListItem button component={Link} to={'/admin/analytics'}>
                            <ListItemText primary="Admin Analytics"/>
                        </ListItem>
                    ) : (<></>)}
                </List>
                <Box className={classes.box}>
                    <Typography className={classes.center}>Account</Typography>
                </Box>
            </Drawer>
            <main className={classes.content}>
                <Container className={classes.container}>
                    <Typography variant={"h5"} style={{marginBottom: 20}}>Admin Analytics</Typography>
                    <div className={classes.profile}>
                        <div>
                            <Typography>TDIII Chess Admins: </Typography>
                            <Typography
                                style={{
                                    display: 'inline-flex',
                                    verticalAlign: "middle",
                                    marginRight: 8
                                }}>{auth.isAuthenticated ? auth.user.first_name.concat(" ", auth.user.last_name) : null}
                            </Typography>

                            {
                                (auth.user.admin && !!(account.admin_analytics)) ? (
                                    <Chip
                                        style={{display: 'inline-flex', verticalAlign: "middle", marginLeft: 8}}
                                        size={"small"}
                                        label={'Admin'}
                                        color={"secondary"}
                                        variant={"outlined"}
                                    />
                                ) : ('')
                            }
                        </div>
                        <Box>
                            {account.admin_loading ? (
                                <Spinner/>
                            ) : (
                                <div>
                                    <Typography>Number of Users: {account.admin_analytics.number_of_users}</Typography>
                                    <Typography>Number of
                                        Tournaments: {account.admin_analytics.number_of_tournaments}</Typography>
                                    <Typography>Number of
                                        Sections: {account.admin_analytics.number_of_sections}</Typography>
                                    <Typography>Number of
                                        Players: {account.admin_analytics.number_of_players}</Typography>
                                    <Typography>Number of
                                        Resultpairings: {account.admin_analytics.number_of_resultpairings}</Typography>
                                </div>
                            )}
                        </Box>
                    </div>
                </Container>
            </main>
        </div>
    );
};

AdminAnalytics.propTypes = {
    auth: PropTypes.object.isRequired,
    account: PropTypes.object.isRequired,
    get_admin_analytics: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
    account: state.account
});

export default connect(mapStateToProps, {get_admin_analytics})(AdminAnalytics);
