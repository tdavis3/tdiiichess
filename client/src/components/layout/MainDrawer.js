import React from "react";

import {Drawer, Typography, Divider} from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";

import DrawerHeader from "./DrawerHeader";


const drawerWidth = 260;

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
    },
    drawer: {
        display: "flex",
        flexDirection: "column",
        width: drawerWidth,
        flexShrink: 0
    },
    drawerPaper: {
        width: drawerWidth,
    },
    footer: {
        marginTop: "auto"
    },
    copyright: {
        display: "flex",
        padding: 14,
        justifyContent: "center"
    }
}));


const MainDrawer = ({children}) => {
    const classes = useStyles();
    return (
        <Drawer
            className={classes.drawer}
            variant="permanent"
            classes={{
                paper: classes.drawerPaper,
            }}
            anchor="left"
        >
            <DrawerHeader/>
            <Divider/>
            {children}
            <div className={classes.footer}>
                <Divider/>
                <div className={classes.copyright}>
                    <Typography variant="body2">
                        {'© '}{new Date().getFullYear()}{' '} TDIII Chess
                    </Typography>
                </div>
            </div>
        </Drawer>
    );
};

export default MainDrawer;
