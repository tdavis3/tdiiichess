import React, {useState} from 'react';

import {
    Grid,
    Button,
    TextField,
    Dialog,
    DialogTitle,
    DialogActions,
    DialogContent,
    DialogContentText,
    Typography
} from "@material-ui/core";

import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {moveSection} from '../../../actions/sections';


const MoveSectionDialog = ({
                               display,
                               setDisplay,
                               setAnchorEl,
                               setNextToDisplay,
                               section,
                               moveSection
                           }) => {

    const [destinationTournament, setDestinationTournament] = useState("");
    const [errorData, setErrorData] = useState({
        validObjectId: false
    });

    const handleMove = () => {
        if (errorData.validObjectId) {
            moveSection(section._id, destinationTournament);
            setNextToDisplay();  // Since a section is deleted from the list of sections
            setDisplay(false);
            setAnchorEl(null);
        }
    };

    const handleClose = () => {
        setDisplay(false);
        setAnchorEl(null);
    };

    const handleChange = name => ({target: {value}}) => {
        setDestinationTournament(value);
        if (name === 'destinationTournamentId') {
            // Valid MongoDB ObjectID
            setErrorData({...errorData, validObjectId: !!(value.match(/^[0-9a-fA-F]{24}$/))});
        }
    };

    return (
        <div>
            <Dialog
                open={display}
                maxWidth={'xs'}
                onClose={handleClose}
                aria-labelledby="move-section-dialog-title"
            >
                <DialogTitle id="move-section-dialog-title">Move section</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        You can only move sections to tournaments in your own account.
                    </DialogContentText>
                    <Grid container spacing={1} alignItems="flex-end">
                        <Grid item>
                            <Typography>Enter the tournament ID:</Typography>
                        </Grid>
                        <Grid item>
                            <TextField
                                id="destination-tournament-id-input"
                                type="text"
                                fullWidth
                                value={destinationTournament}
                                onChange={handleChange('destinationTournamentId')}
                                error={!errorData.validObjectId}
                                helperText={errorData.validObjectId ? "" : "Invalid ID"}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="contained" onClick={handleMove}
                            disabled={(!errorData.validObjectId)} color="primary">
                        Move
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
};

MoveSectionDialog.propTypes = {
    display: PropTypes.bool.isRequired,
    setDisplay: PropTypes.func.isRequired,
    setAnchorEl: PropTypes.func.isRequired,
    setNextToDisplay: PropTypes.func.isRequired,
    section: PropTypes.object.isRequired,
    moveSection: PropTypes.func.isRequired,
};

export default connect(null, {moveSection})(MoveSectionDialog);
