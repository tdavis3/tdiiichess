import React, {useState} from 'react';

import {
    Tooltip,
    Button,
    IconButton,
    Dialog,
    DialogTitle,
    DialogActions,
    DialogContentText,
    Box,
    Tab,
    Tabs
} from "@material-ui/core";
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';

import AddPlayerSearch from "./AddPlayerSearch";
import AddPlayerManual from "./AddPlayerManual";

import PropTypes from 'prop-types';
import {connect} from "react-redux";
import {createPlayer} from "../../../../actions/players";


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


const AddPlayerDialog = ({sectionId, sections, tournament, createPlayer}) => {

    const [tabIndex, setTabIndex] = useState(0);
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true)
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSave = () => {
        // createPlayer(tournament.SK, sectionId, player);
        // setPlayer(initialPlayer);
        setOpen(false);
    };

    const handleTabChange = (event, newIndex) => {
        setTabIndex(newIndex);
    };

    return (
        <div>
            <Tooltip title="Add">
                <span>
                    <IconButton aria-label="add" onClick={handleClickOpen}
                                disabled={sections.sections.length === 0}>
                    <AddCircleOutlineIcon/>
                </IconButton>
                </span>
            </Tooltip>
            <Dialog
                open={open}
                fullWidth={true}
                maxWidth={"sm"}
                onClose={handleClose}
                aria-labelledby="form-dialog-title"
            >
                <DialogTitle id="form-dialog-title">Add Player</DialogTitle>
                <Tabs
                    value={tabIndex}
                    onChange={handleTabChange}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="fullWidth"
                >
                    <Tab label="Player" {...a11yProps(0)}/>
                    <Tab label="Search" {...a11yProps(1)}/>
                </Tabs>
                <TabPanel value={tabIndex} index={0}>
                    <DialogContentText>Enter details</DialogContentText>
                    <AddPlayerManual/>
                    <DialogActions>
                        <Button onClick={handleClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={handleSave}
                                disabled={true}
                                color="primary">
                            Save
                        </Button>
                    </DialogActions>
                </TabPanel>
                <TabPanel value={tabIndex} index={1}>
                    <DialogContentText>Search the USCF database by ID or lastname and state</DialogContentText>
                    <AddPlayerSearch/>
                </TabPanel>
            </Dialog>
        </div>
    )
};

AddPlayerDialog.propTypes = {
    createPlayer: PropTypes.func.isRequired,
    sections: PropTypes.object.isRequired,
    sectionId: PropTypes.string.isRequired,
    tournament: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    sections: state.sections
});

export default connect(mapStateToProps, {createPlayer})(AddPlayerDialog);
