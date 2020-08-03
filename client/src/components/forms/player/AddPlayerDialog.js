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
    DialogContentText,
    Checkbox,
    FormControlLabel
} from "@material-ui/core";
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {MuiPickersUtilsProvider, KeyboardDatePicker} from '@material-ui/pickers';

import ByeInput from "./ByeInput";

import PropTypes from 'prop-types';
import {connect} from "react-redux";
import {createPlayer} from "../../../actions/players";


const AddPlayerDialog = ({sectionId, sections, tournament, createPlayer}) => {

    const initialPlayer = {
        firstName: "",
        lastName: "",
        suffix: "",
        uscfId: "",
        uscfRegRating: "",
        uscfBlitzRating: "",
        uscfQuickRating: "",
        state: "",
        fideId: "",
        fideRating: "",
        expires: "",
        email: "",
        cell: "",
        dob: null,
        withdrew: false,
        byes: []
    };

    const [open, setOpen] = useState(false);
    const [player, setPlayer] = useState(initialPlayer);
    const [selectedDOB, setDOB] = useState(null);
    const [chipByeData, setChipByeData] = useState([]);  // [{roundNumber: #, byePoint: #}]

    const roundAlreadyExists = (roundNumber) => {
        for (const bye of chipByeData) {
            if (bye.roundNumber === roundNumber) {
                return true;
            }
        }
        return false;
    };

    const handleByesAdd = (round, byePoint) => () => {
        if (roundAlreadyExists(round)) {
            // TODO: Display an error text on the UI
            // Assumption: Cannot have multiple byes for the same round
        } else {
            setChipByeData(prevState => {
                return prevState.concat({roundNumber: round, byePoint: byePoint});
            });
            setPlayer({...player, byes: chipByeData.concat({roundNumber: round, byePoint: byePoint})});
        }
    };

    const handleByesDelete = (chipToDelete) => () => {
        const newByesList = chipByeData.filter(bye => bye.roundNumber !== chipToDelete.roundNumber);
        setChipByeData(newByesList);
        setPlayer({...player, newByesList});
    };

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
        createPlayer(tournament.SK, sectionId, player);
        setPlayer(initialPlayer);
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
            <Tooltip title="Add">
                <span>
                    <IconButton aria-label="add" onClick={handleClickOpen}
                                disabled={sections.sections.length === 0}>
                    <AddCircleOutlineIcon/>
                </IconButton>
                </span>
            </Tooltip>
            <Dialog
                open={open}
                fullWidth={true}
                maxWidth={"sm"}
                onClose={handleClose}
                aria-labelledby="form-dialog-title"
            >
                <DialogTitle id="form-dialog-title">Add Player</DialogTitle>
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
                                id="uscfId"
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
                                id="uscfRegRating"
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
                                id="expires"
                                value={player.expires}
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
                    <Button onClick={handleSave}
                            disabled={(player.firstName === "" && player.uscfId === "")}
                            color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
};

AddPlayerDialog.propTypes = {
    createPlayer: PropTypes.func.isRequired,
    sections: PropTypes.object.isRequired,
    sectionId: PropTypes.string.isRequired,
    tournament: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    sections: state.sections
});

export default connect(mapStateToProps, {createPlayer})(AddPlayerDialog);
