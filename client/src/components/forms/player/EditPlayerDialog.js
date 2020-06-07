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
import {editPlayer} from "../../../actions/players";


const EditPlayerDialog = ({editPlayer, selected_edit}) => {

    const originalPlayer = {
        first_name: selected_edit.player_id.first_name,
        last_name: selected_edit.player_id.last_name,
        suffix: selected_edit.player_id.suffix,
        uscf_id: selected_edit.player_id.uscf_id,
        uscf_reg_rating: selected_edit.player_id.uscf_reg_rating,
        uscf_blitz_rating: selected_edit.player_id.uscf_blitz_rating,
        uscf_quick_rating: selected_edit.player_id.uscf_quick_rating,
        state: selected_edit.player_id.state,
        fide_id: selected_edit.player_id.fide_id,
        fide_rating: selected_edit.player_id.fide_rating,
        expired: selected_edit.player_id.expired,
        email: selected_edit.player_id.email,
        cell: selected_edit.player_id.cell,
        dob: selected_edit.player_id.dob
    };

    const [player, setPlayer] = useState(originalPlayer);

    // Any change to the state vis call to setOpen() will re-render the component
    // Closing the modal for example
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true)
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSave = () => {
        editPlayer(selected_edit.player_id._id, player);
        setPlayer(originalPlayer);
        setOpen(false);
    };

    const handleChange = name => ({target: {value}}) => {
        setPlayer({...player, [name]: value})  // Will re-render component
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
                <DialogTitle id="form-dialog-title">Edit Player</DialogTitle>
                <DialogContent>
                    <DialogContentText>Change player details.</DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="First Name"
                        type="text"
                        fullWidth
                        value={player.first_name}
                        onChange={handleChange('first_name')}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Last Name"
                        type="text"
                        fullWidth
                        value={player.last_name}
                        onChange={handleChange('last_name')}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        label="USCF ID"
                        type="text"
                        fullWidth
                        value={player.uscf_id}
                        onChange={handleChange('uscf_id')}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Rating"
                        type="text"
                        fullWidth
                        value={player.uscf_reg_rating}
                        onChange={handleChange('uscf_reg_rating')}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Expires"
                        type="text"
                        fullWidth
                        value={player.expired}
                        onChange={handleChange('expired')}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        label="State"
                        type="text"
                        fullWidth
                        value={player.state}
                        onChange={handleChange('state')}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Date of Birth"
                        type="text"
                        fullWidth
                        value={player.dob}
                        onChange={handleChange('dob')}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Email"
                        type="text"
                        fullWidth
                        value={player.email}
                        onChange={handleChange('email')}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Cell"
                        type="text"
                        fullWidth
                        value={player.cell}
                        onChange={handleChange('cell')}
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

EditPlayerDialog.propTypes = {
    editPlayer: PropTypes.func.isRequired,
};

export default connect(null, {editPlayer})(EditPlayerDialog);
