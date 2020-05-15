import React, {useState} from 'react';

import EditIcon from '@material-ui/icons/Edit';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import {connect} from "react-redux";
import {editTournament} from "../../actions/tournaments";


const EditTournamentDialog = ({editTournament, selectededit}) => {


    const originalTournament = {
        tournamentname: selectededit.name,
        printingname: selectededit.printingname,
        timecontrol: selectededit.timecontrol
    };

    const [tournament, setTournament] = useState(originalTournament);

    // Any change to the state vis call to setOpen() will re-render the component
    // Closing the modal for example
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true)
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSave = event => {
        editTournament(selectededit._id, tournament);
        setOpen(false);
    };

    const handleChange = name => ({target: {value}}) => {
        setTournament({...tournament, [name]: value})  // Will re-render component
    };

    return (
        <div>
            <Tooltip title="Edit">
                <IconButton aria-label="edit" onClick={handleClickOpen}>
                    <EditIcon/>
                </IconButton>
            </Tooltip>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="form-dialog-title"
            >
                <DialogTitle id="form-dialog-title">Edit Tournament</DialogTitle>
                <DialogContent>
                    <DialogContentText>Edit tournament details.</DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Name"
                        type="text"
                        fullWidth
                        value={tournament.tournamentname}
                        onChange={handleChange('tournamentname')}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Printing Name"
                        type="text"
                        fullWidth
                        value={tournament.printingname}
                        onChange={handleChange('printingname')}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Time Control"
                        type="text"
                        fullWidth
                        value={tournament.timecontrol}
                        onChange={handleChange('timecontrol')}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleSave} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
};

EditTournamentDialog.propTypes = {
    editTournament: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({});

export default connect(mapStateToProps, {editTournament})(EditTournamentDialog);
