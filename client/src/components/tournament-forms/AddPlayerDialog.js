import React, {useState} from 'react';

import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {MuiPickersUtilsProvider, KeyboardDatePicker} from '@material-ui/pickers';

import PropTypes from 'prop-types';
import {connect} from "react-redux";
import {createPlayer} from "../../actions/players";


const initialPlayer = {
    first_name: "",
    last_name: "",
    suffix: "",
    uscf_id: "",
    uscf_reg_rating: "",
    uscf_blitz_rating: "",
    uscf_quick_rating: "",
    state: "",
    fide_id: "",
    fide_rating: "",
    expired: "",
    email: "",
    cell: "",
    dob: null
};


const AddPlayerDialog = ({createPlayer, parent_id}) => {
    const [player, setPlayer] = useState(initialPlayer);

    const [selectedDOB, setDOB] = useState(null);

    const handleDOBChange = (date) => {
        setDOB(date);
        setPlayer({...player, dob: date});
    };

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
        console.log("parent id here");
        console.log(parent_id);
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
                    <Grid container spacing={3}>
                        <Grid item xs={6}>
                            <TextField
                                autoFocus
                                margin="dense"
                                label="First Name"
                                type="text"
                                fullWidth
                                value={player.first_name}
                                onChange={handleChange('first_name')}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                autoFocus
                                margin="dense"
                                label="Last Name"
                                type="text"
                                fullWidth
                                value={player.last_name}
                                onChange={handleChange('last_name')}
                            />
                        </Grid>
                    </Grid>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="USCF ID"
                        type="text"
                        fullWidth
                        value={player.uscf_id}
                        onChange={handleChange('uscf_id')}
                    />
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <Grid container spacing={3}>
                            <Grid item xs={6}>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    label="Rating"
                                    type="text"
                                    fullWidth
                                    value={player.uscf_reg_rating}
                                    onChange={handleChange('uscf_reg_rating')}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    label="Expires"
                                    type="text"
                                    fullWidth
                                    value={player.expired}
                                    onChange={handleChange('expired')}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    label="State"
                                    type="text"
                                    fullWidth
                                    value={player.state}
                                    onChange={handleChange('state')}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <KeyboardDatePicker
                                    disableToolbar
                                    // autoOk
                                    variant="inline"
                                    format="MM/dd/yyyy"
                                    margin="normal"
                                    id="dob-date-picker-inline"
                                    label="Date of Birth"
                                    value={selectedDOB}
                                    onChange={handleDOBChange}
                                    KeyboardButtonProps={{
                                        'aria-label': 'change date',
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </MuiPickersUtilsProvider>

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
