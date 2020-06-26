import React, {useState} from 'react';

import {
    Tooltip,
    TextField,
    Button,
    IconButton,
    Grid,
    Select,
    Input,
    InputLabel,
    Dialog,
    DialogTitle,
    DialogActions,
    DialogContent,
    DialogContentText
} from "@material-ui/core";
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';

import PropTypes from 'prop-types';
import {connect} from "react-redux";
import {createSection} from "../../../actions/sections";


const AddSectionDialog = ({tournamentId, createSection, tournament_time_control}) => {

    const initial_section = {
        name: "",
        printing_name: "",
        event_type: "Regular Swiss",
        style: "Regular",
        rating_type: "Regular/Standard",
        coin_toss: "--",
        time_control: tournament_time_control,
        number_of_rounds: 0
    };

    const [section, setSection] = useState(initial_section);
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true)
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSave = () => {
        createSection(tournamentId, section);
        setSection(initial_section);
        setOpen(false);
    };

    const handleChange = e => {
        setSection({...section, [e.target.id]: e.target.value});
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
                    <DialogContentText>Enter details.</DialogContentText>
                    <TextField
                        autoFocus
                        variant={"outlined"}
                        margin="dense"
                        label="Name"
                        type="text"
                        fullWidth
                        id='name'
                        value={section.name}
                        onChange={handleChange}
                    />
                    <TextField
                        autoFocus
                        variant={"outlined"}
                        margin="dense"
                        label="Printing name"
                        type="text"
                        fullWidth
                        id='printing_name'
                        value={section.printing_name}
                        onChange={handleChange}
                    />
                    <TextField
                        autoFocus
                        variant={"outlined"}
                        margin="dense"
                        label="Time control"
                        type="text"
                        fullWidth
                        id='time_control'
                        value={section.time_control}
                        onChange={handleChange}
                    />
                    <Grid container spacing={3} style={{paddingTop: 20}}>
                        <Grid item xs={6}>
                            <InputLabel htmlFor="event_type">Event type</InputLabel>
                            <Select
                                native
                                value={section.event_type}
                                id="event_type"
                                onChange={handleChange}
                                input={<Input id="event_type"/>}
                            >
                                <option value="Regular Swiss">Regular Swiss</option>
                                <option value="Round Robin">Round Robin</option>
                            </Select>
                        </Grid>
                        <Grid item xs={6}>
                            <InputLabel htmlFor="rating_type">Rating type</InputLabel>
                            <Select
                                native
                                id="rating_type"
                                value={section.rating_type}
                                onChange={handleChange}
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
                                id="style"
                                value={section.style}
                                onChange={handleChange}
                                input={<Input id="style"/>}
                            >
                                <option value="Regular">Regular</option>
                                <option value="Double">Double</option>
                            </Select>
                        </Grid>
                        <Grid item xs={3}>
                            <InputLabel htmlFor="coin_toss">Coin toss</InputLabel>
                            <Select
                                native
                                id="coin_toss"
                                value={section.coin_toss}
                                onChange={handleChange}
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
                                label="Number of rounds"
                                type="number"
                                fullWidth
                                id="number_of_rounds"
                                value={section.number_of_rounds}
                                onChange={handleChange}
                                InputProps={{
                                    inputProps: {
                                        min: 0
                                    }
                                }}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={(section.name === "")} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
};

AddSectionDialog.propTypes = {
    createSection: PropTypes.func.isRequired,
    tournamentId: PropTypes.string.isRequired,
};

export default connect(null, {createSection})(AddSectionDialog);
