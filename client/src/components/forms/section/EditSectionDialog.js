import React, {useEffect, useState} from 'react';

import {
    TextField,
    Button,
    Select,
    Input,
    InputLabel,
    Dialog,
    DialogTitle,
    DialogActions,
    DialogContent,
    DialogContentText, Grid
} from "@material-ui/core";

import PropTypes from 'prop-types';
import {connect} from "react-redux";
import {editSection} from "../../../actions/sections";


const EditSectionDialog = ({display, setDisplay, setAnchorEl, editSection, selectedSection}) => {

    useEffect(
        () => {
            setSection(originalSection);
        }, [selectedSection]
    );

    const originalSection = {
        name: selectedSection.name,
        printing_name: selectedSection.printing_name,
        event_type: selectedSection.event_type,
        style: selectedSection.style,
        rating_type: selectedSection.rating_type,
        coin_toss: selectedSection.coin_toss,
        time_control: selectedSection.time_control,
        number_of_rounds: selectedSection.number_of_rounds
    };

    const [section, setSection] = useState(originalSection);

    const handleClose = () => {
        setDisplay(false);
        setAnchorEl(null);
    };

    const handleSave = () => {
        editSection(selectedSection._id, section);
        setDisplay(false);
        setAnchorEl(null);
    };

    const handleChange = e => {
        setSection({...section, [e.target.id]: e.target.value});
    };

    return (
        <div>
            <Dialog
                open={display}
                onClose={handleClose}
                aria-labelledby="form-dialog-title"
            >
                <DialogTitle id="form-dialog-title">Edit this section</DialogTitle>
                <DialogContent>
                    <DialogContentText>Edit details.</DialogContentText>
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
                    <Button onClick={handleSave} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
};

EditSectionDialog.propTypes = {
    display: PropTypes.bool.isRequired,
    setAnchorEl: PropTypes.func.isRequired,
    setDisplay: PropTypes.func.isRequired,
    selectedSection: PropTypes.object.isRequired,
    editSection: PropTypes.func.isRequired,
};

export default connect(null, {editSection})(EditSectionDialog);
