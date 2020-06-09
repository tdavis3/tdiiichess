import React, {useState} from 'react';

import {
    Tooltip,
    TextField,
    Button,
    IconButton,
    Grid,
    Dialog,
    DialogTitle,
    DialogActions,
    DialogContent,
    DialogContentText
} from "@material-ui/core";
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {MuiPickersUtilsProvider, KeyboardDatePicker} from '@material-ui/pickers';

import PropTypes from 'prop-types';
import {connect} from "react-redux";
import {createPlayer} from "../../../actions/players";


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


const AddPlayerDialog = ({sectionId, disabled, createPlayer}) => {
    const [player, setPlayer] = useState(initialPlayer);

    const [selectedDOB, setDOB] = useState(null);

    const handleDOBChange = (date) => {
        setDOB(date);
        setPlayer({...player, dob: date});
    };

    // Any change to the state vis call to setOpen() will re-render the component
    // Closing the modal for example
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true)
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSave = () => {
        console.log("sectionId");
        console.log(sectionId); // what type is this put in Proptypes
        createPlayer(sectionId, player);
        setPlayer(initialPlayer);
        setOpen(false);
    };

    const handleChange = name => ({target: {value}}) => {
        setPlayer({...player, [name]: value})  // Will re-render component
    };

    return (
        <div>
            <Tooltip title="Add">
                <IconButton aria-label="add" onClick={handleClickOpen} disabled={disabled}>
                    <AddCircleOutlineIcon/>
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
    disabled: PropTypes.bool,
    sectionId: PropTypes.string.isRequired
};

export default connect(null, {createPlayer})(AddPlayerDialog);
