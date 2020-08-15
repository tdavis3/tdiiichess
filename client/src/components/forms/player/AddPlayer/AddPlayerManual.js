import React, {useState} from 'react';
import {Button, Checkbox, FormControlLabel, Grid, TextField} from "@material-ui/core";
import {KeyboardDatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import ByeInput from "../ByeInput";

import PropTypes from 'prop-types';
import {connect} from "react-redux";
import {createPlayer} from "../../../../actions/players";
import {ratingParser} from "../../../../utils/helpers";


const AddPlayerManual = ({sectionId, tournament, playerToTransfer, handleClose, createPlayer}) => {

    const initialPlayer = {
        firstName: playerToTransfer.firstName || "",
        lastName: playerToTransfer.lastName || "",
        suffix: playerToTransfer.suffix || "",
        uscfId: playerToTransfer.uscfId || "",
        uscfRegRating: ratingParser(playerToTransfer.regularRating || playerToTransfer.rating || ""),
        uscfBlitzRating: playerToTransfer.blitzRating || "",
        uscfQuickRating: playerToTransfer.quickRating || "",
        state: playerToTransfer.state || "",
        fideId: playerToTransfer.fideId || "",
        fideRating: "",
        expires: playerToTransfer.expirationDate || "",
        email: "",
        cell: "",
        dob: null,
        withdrew: false,
        byes: []
    };

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

    const handleChange = e => {
        if (e.target.id === "withdrew") {
            setPlayer({...player, withdrew: e.target.checked});
        } else {
            setPlayer({...player, [e.target.id]: e.target.value});
        }
    };

    const handleAdd = () => {
        createPlayer(tournament.SK, sectionId, player);
        handleClose();
    };

    return (
        <div>
            <Grid container spacing={3}>
                <Grid item xs={6}>
                    <TextField
                        autoFocus
                        variant={"outlined"}
                        margin="dense"
                        label="First name"
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
                        label="Last name"
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
            <Button onClick={handleClose} color="primary">
                Cancel
            </Button>
            <Button onClick={handleAdd}
                    disabled={player.firstName === ""}
                    color="primary">
                Add
            </Button>
        </div>
    );
};

AddPlayerManual.propTypes = {
    sectionId: PropTypes.string.isRequired,
    tournament: PropTypes.object.isRequired,
    playerToTransfer: PropTypes.object.isRequired,
    handleClose: PropTypes.func.isRequired,
    createPlayer: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    sections: state.sections,
    scraper: state.players.scraper
});

export default connect(mapStateToProps, {createPlayer})(AddPlayerManual);
