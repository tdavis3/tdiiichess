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
import {createTournament} from '../../actions/tournaments';


const AddTournamentDialog = ({createTournament}) => {

    const initialTournament = {
        name: "",
        printing_name: "",
        time_control: "",
        start_date: new Date(),
        end_date: new Date()
    };

    const [tournament, setTournament] = useState(initialTournament);

    const [selectedStartDate, setStartDateChange] = useState(new Date());
    const [selectedEndDate, setEndDateChange] = useState(new Date());

    const [open, setOpen] = React.useState(false);

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
                    <DialogContentText>Enter tournament details.</DialogContentText>
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

AddTournamentDialog.propTypes = {
    createTournament: PropTypes.func.isRequired,
};

export default connect(null, {createTournament})(AddTournamentDialog);
