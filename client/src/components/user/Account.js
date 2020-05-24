import React from "react";
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
import DrawerHeader from "../layout/DrawerHeader";

import PropTypes from "prop-types";
import {connect} from "react-redux";


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
    }
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
                <DrawerHeader
                    first_name={auth.user.first_name}
                    last_name={auth.user.last_name}
                    email={auth.user.email}
                />
                {/*TODO DrawerHeader buttons overlaps the menu buttons in main drawer*/}
                <Divider/>
                <Box className={classes.box}>
                    <Typography className={classes.center}>Menu</Typography>
                </Box>
                <List>
                    <ListItem button component={Link} to={'/tournaments'}>
                        <ListItemText primary="Tournaments"/>
                    </ListItem>
                    {auth.user.admin ? (
                        <ListItem button component={Link} to={'/analytics'}>
                            <ListItemText primary="Analytics"/>
                        </ListItem>
                    ) : (<></>)}
                </List>
                <Box className={classes.box}>
                    <Typography className={classes.center}>Profile</Typography>
                </Box>
            </Drawer>
            <main className={classes.content}>
                <Container className={classes.container}>
                    <Typography variant={"h5"} style={{marginBottom: 20}}>Profile</Typography>
                    <div className={classes.profile}>
                        <div>
                            <Typography
                                style={{display: 'inline-flex', verticalAlign: "middle", marginRight: 8}}
                                variant={"h6"}>{auth.isAuthenticated ? auth.user.first_name.concat(" ", auth.user.last_name) : null} </Typography>
                            {
                                auth.user.admin ? (
                                    <Chip
                                        style={{display: 'inline-flex', verticalAlign: "middle", marginLeft: 8}}
                                        size={"small"}
                                        label={auth.user.admin ? 'Admin' : 'Tournament Director'}
                                        color={"secondary"}
                                        variant={"outlined"}
                                    />
                                ) : ('')
                            }
                        </div>
                        <div>
                            <Typography>Email: {auth.user.email}</Typography>
                            <Typography>Password: ********</Typography>
                        </div>
                    </div>
                </Container>
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
