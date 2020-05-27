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
import {editTournament} from "../../actions/tournaments";


const EditTournamentDialog = ({editTournament, selected_edit}) => {

    const initial_tournament = {
        name: selected_edit.name,
        printing_name: selected_edit.printing_name,
        time_control: selected_edit.time_control,
        start_date: selected_edit.start_date,
        end_date: selected_edit.end_date
    };

    useEffect(() => {
        setTournament(initial_tournament);
    }, [selected_edit]);

    const [tournament, setTournament] = useState(initial_tournament);

    const [selectedStartDate, setStartDateChange] = useState(selected_edit.start_date);
    const [selectedEndDate, setEndDateChange] = useState(selected_edit.end_date);

    const [open, setOpen] = useState(false);

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
        editTournament(selected_edit._id, tournament);
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
                    <DialogContentText>Edit tournament details.</DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Name"
                        type="text"
                        fullWidth
                        value={tournament.name}
                        onChange={handleChange('name')}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Printing Name"
                        type="text"
                        fullWidth
                        value={tournament.printing_name}
                        onChange={handleChange('printing_name')}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Time Control"
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
                                    disableToolbar
                                    // autoOk
                                    variant="inline"
                                    format="MM/dd/yyyy"
                                    margin="normal"
                                    id="start-date-picker-inline"
                                    label="Start Date"
                                    value={selectedStartDate}
                                    onChange={handleStartDateChange}
                                    KeyboardButtonProps={{
                                        'aria-label': 'change date',
                                    }}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <KeyboardDatePicker
                                    disableToolbar
                                    variant="inline"
                                    format="MM/dd/yyyy"
                                    margin="normal"
                                    id="end-date-picker-inline"
                                    label="End Date"
                                    value={selectedEndDate}
                                    onChange={handleEndDateChange}
                                    // InputAdornmentProps={{position: "start"}}
                                    KeyboardButtonProps={{
                                        'aria-label': 'change date',
                                    }}
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
    selected_edit: PropTypes.object.isRequired
};

export default connect(null, {editTournament})(EditTournamentDialog);
