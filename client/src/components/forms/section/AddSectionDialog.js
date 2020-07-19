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


const AddSectionDialog = ({tournamentId, createSection, tournamentTimeControl}) => {

    const initialSection = {
        name: "",
        printingName: "",
        eventType: "Regular Swiss",
        style: "Regular",
        ratingType: "Regular/Standard",
        coinToss: "--",
        timeControl: tournamentTimeControl,
        numberOfRounds: 0
    };

    const [section, setSection] = useState(initialSection);
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true)
    };

    const handleClose = () => {
        setSection(initialSection);
        setOpen(false);
    };

    const handleSave = () => {
        createSection(tournamentId, section);
        setSection(initialSection);
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
                        id='printingName'
                        value={section.printingName}
                        onChange={handleChange}
                    />
                    <TextField
                        autoFocus
                        variant={"outlined"}
                        margin="dense"
                        label="Time control"
                        type="text"
                        fullWidth
                        id='timeControl'
                        value={section.timeControl}
                        onChange={handleChange}
                    />
                    <Grid container spacing={3} style={{paddingTop: 20}}>
                        <Grid item xs={6}>
                            <InputLabel htmlFor="eventType">Event type</InputLabel>
                            <Select
                                native
                                value={section.eventType}
                                id="eventType"
                                onChange={handleChange}
                                input={<Input id="eventType"/>}
                            >
                                <option value="Regular Swiss">Regular Swiss</option>
                                <option value="Round Robin">Round Robin</option>
                            </Select>
                        </Grid>
                        <Grid item xs={6}>
                            <InputLabel htmlFor="ratingType">Rating type</InputLabel>
                            <Select
                                native
                                id="ratingType"
                                value={section.ratingType}
                                onChange={handleChange}
                                input={<Input id="ratingType"/>}
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
                            <InputLabel htmlFor="coinToss">Coin toss</InputLabel>
                            <Select
                                native
                                id="coinToss"
                                value={section.coinToss}
                                onChange={handleChange}
                                input={<Input id="coinToss"/>}
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
                                id="numberOfRounds"
                                value={section.numberOfRounds}
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
