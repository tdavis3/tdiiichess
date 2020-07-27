import React, {useEffect, useState} from 'react';

import {
    Tooltip,
    TextField,
    Button,
    IconButton,
    Dialog,
    DialogTitle,
    DialogActions,
    DialogContent,
    DialogContentText, Grid
} from "@material-ui/core";
import EditIcon from '@material-ui/icons/Edit';
import 'date-fns';
import DateFnsUtils from "@date-io/date-fns";
import {KeyboardDatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";

import PropTypes from 'prop-types';
import {connect} from "react-redux";
import {editTournament} from "../../../actions/tournaments";


const EditTournamentDialog = ({editTournament, selectedTournament}) => {

    const initialTournament = {
        name: selectedTournament.name,
        printingName: selectedTournament.printingName,
        timeControl: selectedTournament.timeControl,
        startDate: selectedTournament.startDate,
        endDate: selectedTournament.endDate
    };

    useEffect(() => {
        setTournament(initialTournament);
    }, [selectedTournament]);

    const [open, setOpen] = useState(false);
    const [tournament, setTournament] = useState(initialTournament);
    const [selectedStartDate, setStartDateChange] = useState(selectedTournament.startDate);
    const [selectedEndDate, setEndDateChange] = useState(selectedTournament.endDate);

    const handleStartDateChange = (date) => {
        setStartDateChange(date);
        setTournament({...tournament, startDate: date});
    };

    const handleEndDateChange = (date) => {
        setEndDateChange(date);
        setTournament({...tournament, endDate: date});
    };

    const handleClickOpen = () => {
        setOpen(true)
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSave = () => {  // event parameter
        const userId = selectedTournament.PK.split("#")[1];
        const tournamentId = selectedTournament.SK.split("#")[1];
        editTournament(tournamentId, {...selectedTournament, ...tournament});
        setOpen(false);
    };

    const handleChange = e => {
        setTournament({...tournament, [e.target.id]: e.target.value});
    };

    return (
        <div>
            <Tooltip title="Edit">
                <IconButton aria-label="edit" onClick={handleClickOpen}>
                    <EditIcon fontSize={"small"}/>
                </IconButton>
            </Tooltip>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="form-dialog-title"
            >
                <DialogTitle id="form-dialog-title">Edit Tournament</DialogTitle>
                <DialogContent>
                    <DialogContentText>Edit details.</DialogContentText>
                    <TextField
                        autoFocus
                        variant={"outlined"}
                        margin="dense"
                        label="Name"
                        type="text"
                        fullWidth
                        id="name"
                        value={tournament.name}
                        onChange={handleChange}
                    />
                    <TextField
                        autoFocus
                        variant={"outlined"}
                        margin="dense"
                        label="Printing name"
                        type="text"
                        fullWidth
                        id="printingName"
                        value={tournament.printingName}
                        onChange={handleChange}
                    />
                    <TextField
                        autoFocus
                        variant={"outlined"}
                        margin="dense"
                        label="Time control"
                        type="text"
                        fullWidth
                        id="timeControl"
                        value={tournament.timeControl}
                        onChange={handleChange}
                    />
                    <small id="time_control_info" className="form-text text-muted">
                        Only if all sections have the same time control.
                    </small>

                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <Grid container spacing={3}>
                            <Grid item xs={6}>
                                <KeyboardDatePicker
                                    autoOk
                                    variant="inline"
                                    inputVariant={"outlined"}
                                    format="MM/dd/yyyy"
                                    margin="normal"
                                    id="start-date-picker-inline"
                                    label="Start date"
                                    value={selectedStartDate}
                                    onChange={handleStartDateChange}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <KeyboardDatePicker
                                    autoOk
                                    variant="inline"
                                    inputVariant={"outlined"}
                                    format="MM/dd/yyyy"
                                    margin="normal"
                                    id="end-date-picker-inline"
                                    label="End date"
                                    value={selectedEndDate}
                                    onChange={handleEndDateChange}
                                />
                            </Grid>
                        </Grid>
                    </MuiPickersUtilsProvider>
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

EditTournamentDialog.propTypes = {
    editTournament: PropTypes.func.isRequired,
    selectedTournament: PropTypes.object.isRequired
};

export default connect(null, {editTournament})(EditTournamentDialog);
