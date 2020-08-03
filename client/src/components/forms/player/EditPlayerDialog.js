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


const EditPlayerDialog = ({editPlayer, selectedPlayer}) => {

    const originalPlayer = {
        firstName: selectedPlayer.firstName,
        lastName: selectedPlayer.lastName,
        suffix: selectedPlayer.suffix,
        uscfId: selectedPlayer.uscfId,
        uscfRegRating: selectedPlayer.uscfRegRating,
        uscfBlitzRating: selectedPlayer.uscfBlitzRating,
        uscfQuickRating: selectedPlayer.uscfQuickRating,
        state: selectedPlayer.state,
        fideId: selectedPlayer.fideId,
        fideRating: selectedPlayer.fideRating,
        expired: selectedPlayer.expired,
        email: selectedPlayer.email,
        cell: selectedPlayer.cell,
        dob: selectedPlayer.dob,
        withdrew: selectedPlayer.withdrew,
        byes: selectedPlayer.byes
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
        editPlayer(selectedPlayer.SK, player);
        setPlayer(originalPlayer);
        setOpen(false);
    };

    const handleChange = e => {
        if (e.target.id === "withdrew") {
            setPlayer({...player, withdrew: e.target.checked});
            return;
        }
        setPlayer({...player, [e.target.id]: e.target.value});
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
                                id="firstName"
                                value={player.firstName}
                                onChange={handleChange}
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
                                id="lastName"
                                value={player.lastName}
                                onChange={handleChange}
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
                                id="uscf_id"
                                value={player.uscfId}
                                onChange={handleChange}
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
                                id="uscf_reg_rating"
                                value={player.uscfRegRating}
                                onChange={handleChange}
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
                                id="state"
                                value={player.state}
                                onChange={handleChange}
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
                                id="expired"
                                value={player.expired}
                                onChange={handleChange}
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
                                    id="cell"
                                    value={player.cell}
                                    onChange={handleChange}
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
                        id="email"
                        value={player.email}
                        onChange={handleChange}
                    />
                    <Grid container spacing={3} alignItems={"center"}>
                        <Grid item xs={3}>
                            <FormControlLabel
                                control={<Checkbox id="withdrew" checked={player.withdrew} onChange={handleChange}/>}
                                label={"Withdraw"}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <ByeInput
                                chipByeData={chipByeData}
                                handleByesAdd={handleByesAdd}
                                handleByesDelete={handleByesDelete}
                            />
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
    selectedEdit: PropTypes.object.isRequired
};

export default connect(null, {editPlayer})(EditPlayerDialog);
