import React, {useState} from 'react';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";

import {createSection} from "../../actions/sections";
import {connect} from "react-redux";
import Grid from "@material-ui/core/Grid";
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';

const initialSection = {
    name: "",
    printing_name: "",
    event_type: "Regular Swiss",
    style: "Regular",
    rating_type: "Regular/Standard",
    coin_toss: "--",
    time_control: "",
    number_of_rounds: 1
};

const AddSectionDialog = ({createSection, parent_id}) => {
    const [section, setSection] = useState(initialSection);

    // Any change to the state vis call to setOpen() will re-render the component
    // Closing the modal for example
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true)
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSave = event => {
        createSection(parent_id, section);
        setSection(initialSection);
        setOpen(false);
    };

    const handleChange = name => ({target: {value}}) => {
        setSection({...section, [name]: value})  // Will re-render component
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
                <DialogTitle id="form-dialog-title">Create Section</DialogTitle>
                <DialogContent>
                    <DialogContentText>Enter section details.</DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Name"
                        type="text"
                        fullWidth
                        value={section.name}
                        onChange={handleChange('name')}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Printing Name"
                        type="text"
                        fullWidth
                        value={section.printing_name}
                        onChange={handleChange('printing_name')}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Time Control"
                        type="text"
                        fullWidth
                        value={section.time_control}
                        onChange={handleChange('time_control')}
                    />
                    <Grid container spacing={3} style={{paddingTop: 20}}>
                        <Grid item xs={6}>
                            <InputLabel htmlFor="event_type">Event Type</InputLabel>
                            <Select
                                native
                                value={section.event_type}
                                onChange={handleChange('event_type')}
                                input={<Input id="event_type"/>}
                            >
                                <option value="Regular Swiss">Regular Swiss</option>
                                <option value="Round Robin">Round Robin</option>
                            </Select>
                        </Grid>
                        <Grid item xs={6}>
                            <InputLabel htmlFor="rating_type">Rating Type</InputLabel>
                            <Select
                                native
                                value={section.rating_type}
                                onChange={handleChange('rating_type')}
                                input={<Input id="rating_type"/>}
                            >
                                <option value="Regular/Standard">Regular/Standard</option>
                                <option value="Quick/Rapid">Quick/Rapid</option>
                                <option value="Blitz">Blitz</option>
                            </Select>
                        </Grid>
                        <Grid item xs={3}>
                            <InputLabel htmlFor="style">Style</InputLabel>
                            <Select
                                native
                                value={section.style}
                                onChange={handleChange('style')}
                                input={<Input id="style"/>}
                            >
                                <option value="Regular">Regular</option>
                                <option value="Double">Double</option>
                            </Select>
                        </Grid>
                        <Grid item xs={3}>
                            <InputLabel htmlFor="coin_toss">Coin Toss</InputLabel>
                            <Select
                                native
                                value={section.coin_toss}
                                onChange={handleChange('coin_toss')}
                                input={<Input id="coin_toss"/>}
                            >
                                <option value="--">--</option>
                                <option value="High">High</option>
                                <option value="Low">Low</option>
                            </Select>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                autoFocus
                                margin="dense"
                                label="Number of Rounds"
                                type="number"
                                fullWidth
                                value={section.number_of_rounds}
                                onChange={handleChange('number_of_rounds')}
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

AddSectionDialog.propTypes = {
    createSection: PropTypes.func.isRequired,
};

export default connect(null, {createSection})(AddSectionDialog);
