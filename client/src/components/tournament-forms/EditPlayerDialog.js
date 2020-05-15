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

import {editPlayer} from "../../actions/players";
import {connect} from "react-redux";


const EditPlayerDialog = ({editPlayer, selectededit}) => {

    const originalPlayer = {
        firstname: selectededit.playerid.firstname,
        lastname: selectededit.playerid.lastname,
        suffix: selectededit.playerid.suffix,
        uscfid: selectededit.playerid.uscfid,
        uscfregrating: selectededit.playerid.uscfregrating,
        uscfblitzrating: selectededit.playerid.uscfblitzrating,
        uscfquickrating: selectededit.playerid.uscfquickrating,
        state: selectededit.playerid.state,
        fideid: selectededit.playerid.fideid,
        fiderating: selectededit.playerid.fiderating,
        expired: selectededit.playerid.expired,
        email: selectededit.playerid.email,
        cell: selectededit.playerid.cell,
        dob: selectededit.playerid.dob
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

    const handleSave = event => {
        editPlayer(selectededit.playerid._id, player);
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
                        value={player.firstname}
                        onChange={handleChange('firstname')}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Last Name"
                        type="text"
                        fullWidth
                        value={player.lastname}
                        onChange={handleChange('lastname')}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        label="USCF ID"
                        type="text"
                        fullWidth
                        value={player.uscfid}
                        onChange={handleChange('uscfid')}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Rating"
                        type="text"
                        fullWidth
                        value={player.uscfregrating}
                        onChange={handleChange('uscfregrating')}
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
