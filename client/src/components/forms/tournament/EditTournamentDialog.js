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

    const initial_tournament = {
        name: selectedTournament.name,
        printing_name: selectedTournament.printing_name,
        time_control: selectedTournament.time_control,
        start_date: selectedTournament.start_date,
        end_date: selectedTournament.end_date
    };

    useEffect(() => {
        setTournament(initial_tournament);
    }, [selectedTournament]);

    const [open, setOpen] = useState(false);
    const [tournament, setTournament] = useState(initial_tournament);
    const [selectedStartDate, setStartDateChange] = useState(selectedTournament.start_date);
    const [selectedEndDate, setEndDateChange] = useState(selectedTournament.end_date);

    const handleStartDateChange = (date) => {
        setStartDateChange(date);
        setTournament({...tournament, start_date: date});
    };

    const handleEndDateChange = (date) => {
        setEndDateChange(date);
        setTournament({...tournament, end_date: date});
    };

    const handleClickOpen = () => {
        setOpen(true)
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSave = () => {  // event parameter
        editTournament(selectedTournament._id, tournament);
        setOpen(false);
    };

    const handleChange = name => ({target: {value}}) => {
        setTournament({...tournament, [name]: value})  // Will re-render component
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
                        value={tournament.name}
                        onChange={handleChange('name')}
                    />
                    <TextField
                        autoFocus
                        variant={"outlined"}
                        margin="dense"
                        label="Printing name"
                        type="text"
                        fullWidth
                        value={tournament.printing_name}
                        onChange={handleChange('printing_name')}
                    />
                    <TextField
                        autoFocus
                        variant={"outlined"}
                        margin="dense"
                        label="Time control"
                        type="text"
                        fullWidth
                        value={tournament.time_control}
                        onChange={handleChange('time_control')}
                    />
                    <small id="timecontrolinfo" className="form-text text-muted">
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
