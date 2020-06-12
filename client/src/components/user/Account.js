import React, {useEffect, useState} from "react";
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
    ListItemText,
    Grid
} from '@material-ui/core';
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";

import Spinner from "../layout/Spinner";
import DrawerHeader from "../layout/DrawerHeader";
import EditUserEmailDialog from "../forms/user/EditUserEmailDialog";
import EditUserPasswordDialog from "../forms/user/EditUserPasswordDialog";

import PropTypes from "prop-types";
import {connect} from "react-redux";
import {getUserAnalytics} from "../../actions/account";
import SnackbarAlert from "../layout/SnackbarAlert";


const drawerWidth = 260;

function TabPanel(props) {
    const {children, value, index, ...other} = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3}>
                    {children}
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

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
    tabRoot: {
        flexGrow: 1
    },
    tabPanel: {
        marginTop: 20,
    },
    gridVerticalCenter: {
        display: "flex",
        alignItems: "center"
    }
}));


const Account = ({auth, account, getUserAnalytics}) => {
    const classes = useStyles();

    useEffect(
        () => {
            getUserAnalytics(auth.user._id);
        }, []
    );

    const [tabIndex, setTabIndex] = useState(0);

    const handleChange = (event, newIndex) => {
        setTabIndex(newIndex);
    };

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
                    <SnackbarAlert/>
                    <Typography variant={"h5"} style={{marginBottom: 20}}>Account</Typography>
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
                                        label={'Admin'}
                                        color={"secondary"}
                                        variant={"outlined"}
                                    />
                                ) : ('')
                            }
                        </div>
                        <Box className={classes.tabPanel}>
                            <Tabs
                                value={tabIndex}
                                onChange={handleChange}
                                indicatorColor="primary"
                                textColor="primary"
                                // centered
                            >
                                <Tab label="Analytics" {...a11yProps(0)}/>
                                <Tab label="Profile" {...a11yProps(1)}/>
                            </Tabs>
                            <TabPanel value={tabIndex} index={0}>
                                {account.user_loading ? (
                                    <Spinner/>
                                ) : (
                                    <Typography>Number of Tournaments: {account.user_analytics.tournaments}</Typography>
                                )}
                            </TabPanel>
                            <TabPanel value={tabIndex} index={1}>
                                <Grid container direction={"column"}>
                                    <Grid item xs={12} container>
                                        <Grid item xs={9} md={5} lg={3} className={classes.gridVerticalCenter}>
                                            <Typography noWrap>Email: {auth.user.email}</Typography>
                                        </Grid>
                                        <Grid item xs={2} md={2} lg={2}>
                                            <EditUserEmailDialog/>
                                        </Grid>
                                    </Grid>
                                    <Grid item xs={12} container>
                                        <Grid item xs={9} md={5} lg={3} className={classes.gridVerticalCenter}>
                                            <Typography noWrap>Password: ********</Typography>
                                        </Grid>
                                        <Grid item xs={2} md={2} lg={2}>
                                            <EditUserPasswordDialog/>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </TabPanel>
                        </Box>
                    </div>
                </Container>
            </main>
        </div>
    );
};

Account.propTypes = {
    auth: PropTypes.object.isRequired,
    account: PropTypes.object.isRequired,
    getUserAnalytics: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
    account: state.account
});

export default connect(mapStateToProps, {getUserAnalytics})(Account);
