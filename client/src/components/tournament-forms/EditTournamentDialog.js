import React, {useState} from 'react';

import {
    Tooltip,
    TextField,
    Button,
    IconButton,
    Dialog,
    DialogTitle,
    DialogActions,
    DialogContent,
    DialogContentText
} from "@material-ui/core";
import EditIcon from '@material-ui/icons/Edit';

import PropTypes from 'prop-types';
import {connect} from "react-redux";
import {editTournament} from "../../actions/tournaments";

const EditTournamentDialog = ({editTournament, selected_edit}) => {

    const initial_tournament = {
        name: selected_edit.name,
        printing_name: selected_edit.printing_name,
        time_control: selected_edit.time_control
    };

    const [tournament, setTournament] = useState(initial_tournament);

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true)
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSave = () => {  // event parameter
        editTournament(selected_edit._id, tournament);
        setOpen(false);
        setTournament(initial_tournament);
    };

    const handleChange = name => ({target: {value}}) => {
        setTournament({...tournament, [name]: value})  // Will re-render component
    };

    return (
        <div>
            <Tooltip title="Edit">
                <IconButton aria-label="edit" onClick={handleClickOpen}>
                    <EditIcon fontSize={"small"}/>
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
                        value={tournament.name}
                        onChange={handleChange('name')}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Printing Name"
                        type="text"
                        fullWidth
                        value={tournament.printing_name}
                        onChange={handleChange('printing_name')}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Time Control"
                        type="text"
                        fullWidth
                        value={tournament.time_control}
                        onChange={handleChange('time_control')}
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

export default connect(null, {editTournament})(EditTournamentDialog);
