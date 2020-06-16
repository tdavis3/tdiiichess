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
    DialogContentText, Checkbox, FormControlLabel, Grid
} from "@material-ui/core";
import EditIcon from '@material-ui/icons/Edit';
import {KeyboardDatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

import ByeInput from "./ByeInput";

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
        dob: selected_edit.player_id.dob,
        withdrew: selected_edit.player_id.withdrew,
        byes: selected_edit.byes
    };

    const [player, setPlayer] = useState(originalPlayer);
    const [open, setOpen] = useState(false);
    const [selectedDOB, setDOB] = useState(null);

    const handleDOBChange = (date) => {
        setDOB(date);
        setPlayer({...player, dob: date});
    };

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
                    <DialogContentText>Enter details.</DialogContentText>
                    <Grid container spacing={3}>
                        <Grid item xs={6}>
                            <TextField
                                autoFocus
                                variant={"outlined"}
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
                                variant={"outlined"}
                                margin="dense"
                                label="Last Name"
                                type="text"
                                fullWidth
                                value={player.last_name}
                                onChange={handleChange('last_name')}
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={3}>
                        <Grid item xs={6}>
                            <TextField
                                autoFocus
                                variant={"outlined"}
                                margin="dense"
                                label="USCF ID"
                                type="text"
                                fullWidth
                                value={player.uscf_id}
                                onChange={handleChange('uscf_id')}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                autoFocus
                                variant={"outlined"}
                                margin="dense"
                                label="Rating"
                                type="text"
                                fullWidth
                                value={player.uscf_reg_rating}
                                onChange={handleChange('uscf_reg_rating')}
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={3}>
                        <Grid item xs={6}>
                            <TextField
                                autoFocus
                                margin="dense"
                                variant={"outlined"}
                                label="State"
                                type="text"
                                fullWidth
                                value={player.state}
                                onChange={handleChange('state')}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                autoFocus
                                variant={"outlined"}
                                margin="dense"
                                label="Expires"
                                type="text"
                                fullWidth
                                value={player.expired}
                                onChange={handleChange('expired')}
                            />
                        </Grid>
                    </Grid>

                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <Grid container alignItems={"center"} spacing={3}>
                            <Grid item xs={6}>
                                <TextField
                                    autoFocus
                                    variant={"outlined"}
                                    margin="dense"
                                    label="Cell"
                                    type="text"
                                    fullWidth
                                    value={player.cell}
                                    onChange={handleChange('cell')}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <KeyboardDatePicker
                                    autoOk
                                    variant={"inline"}
                                    inputVariant={"outlined"}
                                    format="MM/dd/yyyy"
                                    margin="normal"
                                    id="dob-date-picker-inline"
                                    label="Date of Birth"
                                    disableFuture={true}
                                    value={selectedDOB}
                                    onChange={handleDOBChange}
                                />
                            </Grid>
                        </Grid>
                    </MuiPickersUtilsProvider>
                    <TextField
                        autoFocus
                        variant={"outlined"}
                        margin="dense"
                        label="Email"
                        type="text"
                        fullWidth
                        value={player.email}
                        onChange={handleChange('email')}
                    />
                    <Grid container spacing={3} alignItems={"center"}>
                        <Grid item xs={3}>
                            <FormControlLabel
                                control={<Checkbox checked={player.withdrew} onChange={handleChange('withdrew')}/>}
                                label={"Withdraw"}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <ByeInput byes={player.byes}/>
                        </Grid>
                    </Grid>
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
