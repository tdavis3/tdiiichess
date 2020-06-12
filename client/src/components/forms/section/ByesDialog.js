import React, {useState} from "react";

import makeStyles from "@material-ui/core/styles/makeStyles";
import {
    CssBaseline,
    Box,
    List,
    ListItem,
    ListItemText,
    Dialog,
    DialogTitle,
    Button,
    Typography
} from '@material-ui/core';
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import PropTypes from "prop-types";
import {connect} from "react-redux";


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
    gridVerticalCenter: {
        display: "flex",
        alignItems: "center"
    }
}));


const ByesDialog = ({sections}) => {
    const classes = useStyles();

    const [tabIndex, setTabIndex] = useState(0);
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true)
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleChange = (event, newIndex) => {
        setTabIndex(newIndex);
    };

    return (
        <div className={classes.root}>
            <CssBaseline/>
            <Button size={"small"} onClick={handleClickOpen}>
                Byes
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
                fullWidth
                maxWidth={"sm"}
                scroll={"paper"}
                aria-labelledby="form-dialog-title"
            >
                <DialogTitle id="form-dialog-title">Byes</DialogTitle>
                <Tabs
                    value={tabIndex}
                    onChange={handleChange}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="fullWidth"
                >
                    <Tab label="Players with a bye" {...a11yProps(0)}/>
                    <Tab label="Active Players" {...a11yProps(1)}/>
                    <Tab label="Summary" {...a11yProps(2)}/>
                </Tabs>
                <TabPanel value={tabIndex} index={0}>
                    <Typography align={"center"}>Players inactive for next round</Typography>
                    <List>
                        <ListItem button>
                            <ListItemText primary="Tyrone Davis III"/>
                        </ListItem>
                        <ListItem button>
                            <ListItemText primary="Angel Lopez Jr."/>
                        </ListItem>
                        <ListItem button>
                            <ListItemText primary="Sumit Dhar"/>
                        </ListItem>
                    </List>
                </TabPanel>
                <TabPanel value={tabIndex} index={1}>
                    <Typography align={"center"}>Players active for next round</Typography>
                    <List>
                        <ListItem button>
                            <ListItemText primary="Russell Makofsky"/>
                        </ListItem>
                        <ListItem button>
                            <ListItemText primary="Swarup Dhar"/>
                        </ListItem>
                    </List>
                </TabPanel>
                <TabPanel value={tabIndex} index={2}>
                    <Typography align={"center"}>All players with byes</Typography>
                    <List>
                        <ListItem button>
                            <ListItemText primary="Russell Makofsky: 2, 6"/>
                        </ListItem>
                        <ListItem button>
                            <ListItemText primary="Swarup Dhar: 1, 8"/>
                        </ListItem>
                    </List>
                </TabPanel>
            </Dialog>
        </div>
    );
};

ByesDialog.propTypes = {
    sections: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    sections: state.sections
});

export default connect(mapStateToProps, null)(ByesDialog);
