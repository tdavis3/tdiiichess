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


const AddPlayerDialog = ({sectionId, sections, createPlayer}) => {

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
        dob: null,
        withdrew: false,
        byes: []
    };

    const [open, setOpen] = useState(false);
    const [player, setPlayer] = useState(initialPlayer);
    const [selectedDOB, setDOB] = useState(null);
    const [chipByeData, setChipByeData] = useState([]);  // [{round_number: #, bye_point: #}]

    const roundAlreadyExists = (roundNumber) => {
        for (const bye of chipByeData) {
            if (bye.round_number === roundNumber) {
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
                return prevState.concat({round_number: round, bye_point: byePoint});
            });
            setPlayer({...player, byes: chipByeData.concat({round_number: round, bye_point: byePoint})});
        }
    };

    const handleByesDelete = (chipToDelete) => () => {
        const newByesList = chipByeData.filter(bye => bye.round_number !== chipToDelete.round_number);
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
        createPlayer(sectionId, player);
        setPlayer(initialPlayer);
        setOpen(false);
    };

    const handleChange = name => ({target: {value, checked}}) => {
        if (name === "withdrew") {
            setPlayer({...player, withdrew: checked});
        } else {
            setPlayer({...player, [name]: value});
        }
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
                            disabled={(player.first_name === "" && player.uscf_id === "")}
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
    sectionId: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
    sections: state.sections
});

export default connect(mapStateToProps, {createPlayer})(AddPlayerDialog);
