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
            if (section.SK !== destinationTournament) {
                moveSection(section.SK, destinationTournament);
                setNextToDisplay();  // Since a section is deleted from the list of sections
                setDisplay(false);
                setAnchorEl(null);
            } else {
                console.log("Cannot move to the same tournament.");
            }
        }
    };

    const handleClose = () => {
        setDisplay(false);
        setAnchorEl(null);
    };

    const handleChange = e => {
        setDestinationTournament(e.target.value);
        if (e.target.id === 'destinationTournamentId') {
            // Valid MongoDB ObjectID check
            setErrorData({...errorData, validObjectId: !!(e.target.value.match(/^[0-9a-fA-F]{24}$/))});
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
                                id="destinationTournamentId"
                                value={destinationTournament}
                                onChange={handleChange}
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
