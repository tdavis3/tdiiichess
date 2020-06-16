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
import {connect} from 'react-redux';
import {createTournament} from '../../../actions/tournaments';

let moment = require('moment');
moment().format();


const AddTournamentDialog = ({createTournament}) => {

    const initialTournament = {
        name: "",
        printing_name: "",
        time_control: "",
        start_date: moment().startOf('day'),
        end_date: moment().startOf('day')
    };

    const [tournament, setTournament] = useState(initialTournament);

    const [selectedStartDate, setStartDateChange] = useState(moment().startOf('day'));
    const [selectedEndDate, setEndDateChange] = useState(moment().startOf('day'));

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

    const handleSave = _ => {  // event parameter
        createTournament(tournament);
        setTournament(initialTournament);
        setOpen(false);
    };

    const handleChange = name => ({target: {value}}) => {
        setTournament({...tournament, [name]: value})  // Will re-render component
    };

    return (
        <div>
            <Tooltip title="Add">
                <IconButton aria-label="add" onClick={handleClickOpen}>
                    <AddCircleOutlineIcon/>
                </IconButton>
            </Tooltip>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="form-dialog-title"
            >
                <DialogTitle id="form-dialog-title">Create Tournament</DialogTitle>
                <DialogContent>
                    <DialogContentText>Enter details.</DialogContentText>
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
                    <Button onClick={handleSave} disabled={(tournament.name === "")} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
};

AddTournamentDialog.propTypes = {
    createTournament: PropTypes.func.isRequired,
};

export default connect(null, {createTournament})(AddTournamentDialog);
