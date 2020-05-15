import React, {useState} from 'react';

import AddIcon from '@material-ui/icons/Add';
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

import {createPlayer} from "../../actions/players";
import {connect} from "react-redux";

const initialPlayer = {
    firstname: "",
    lastname: "",
    suffix: "",
    uscfid: "",
    uscfregrating: "",
    uscfblitzrating: "",
    uscfquickrating: "",
    state: "",
    fideid: "",
    fiderating: "",
    expired: "",
    email: "",
    cell: "",
    dob: ""
};

const AddPlayerDialog = props => {
    const [player, setPlayer] = useState(initialPlayer);
    const {createPlayer, parent_id} = props;

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
        createPlayer(parent_id, player);
        setPlayer(initialPlayer);
        setOpen(false);
    };

    const handleChange = name => ({target: {value}}) => {
        setPlayer({...player, [name]: value})  // Will re-render component
    };

    return (
        <div>
            <Tooltip title="Add">
                <IconButton aria-label="add" onClick={handleClickOpen}>
                    <AddIcon/>
                </IconButton>
            </Tooltip>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="form-dialog-title"
            >
                <DialogTitle id="form-dialog-title">Add Player</DialogTitle>
                <DialogContent>
                    <DialogContentText>Enter player details.</DialogContentText>
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

AddPlayerDialog.propTypes = {
    createPlayer: PropTypes.func.isRequired,
};

export default connect(null, {createPlayer})(AddPlayerDialog);
