import React, {useState} from 'react';

import {
    Tooltip,
    Button,
    IconButton,
    Dialog,
    DialogTitle,
    DialogActions,
    DialogContent,
    DialogContentText
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";

import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {deleteTournament} from '../../actions/tournaments';


const DeleteTournamentDialog = ({deleteTournament, tournament}) => {

    // Any change to the state vis call to setOpen() will re-render the component
    // Closing the modal for example
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true)
    };

    const handleYes = () => {
        deleteTournament(tournament._id);
        setOpen(false);
    };

    const handleNo = () => {
        setOpen(false);
    };

    return (
        <div>
            <Tooltip title="Delete">
                <IconButton aria-label="Delete" onClick={handleClickOpen}>
                    <DeleteIcon fontSize={"small"}/>
                </IconButton>
            </Tooltip>
            <Dialog
                open={open}
                maxWidth={'xs'}
                onClose={handleNo}
                aria-labelledby="alert-dialog-title"
            >
                <DialogTitle id="alert-dialog-title">Are you sure you want to delete {tournament.name} ?</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        When you delete a tournament you will also delete all associated sections, players, pairings and
                        results. This action is irreversible.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" onClick={handleNo}>
                        No
                    </Button>
                    <Button variant="contained" onClick={handleYes} color="secondary">
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
};

DeleteTournamentDialog.propTypes = {
    deleteTournament: PropTypes.func.isRequired,
};

export default connect(null, {deleteTournament})(DeleteTournamentDialog);
