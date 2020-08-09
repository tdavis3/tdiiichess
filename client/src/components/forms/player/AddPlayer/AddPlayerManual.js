import React, {useState} from 'react';
import {Checkbox, FormControlLabel, Grid, TextField} from "@material-ui/core";
import {KeyboardDatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import ByeInput from "../ByeInput";

const AddPlayerManual = () => {

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
    return (
        <div>
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
        </div>
    );
};

AddPlayerManual.propTypes = {};

export default AddPlayerManual;
