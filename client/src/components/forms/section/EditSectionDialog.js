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
    DialogContentText
} from "@material-ui/core";

import PropTypes from 'prop-types';
import {connect} from "react-redux";
import {editSection} from "../../../actions/sections";


const EditSectionDialog = ({display, setAnchorEl, setDisplay, editSection, selectedSection}) => {

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

    const handleChange = name => ({target: {value}}) => {
        setSection({...section, [name]: value})  // Will re-render component
    };

    return (
        <div>
            <Dialog
                open={display}
                onClose={handleClose}
                aria-labelledby="form-dialog-title"
            >
                <DialogTitle id="form-dialog-title">Edit Section</DialogTitle>
                <DialogContent>
                    <DialogContentText>Change section details.</DialogContentText>
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

                    <TextField
                        autoFocus
                        margin="dense"
                        label="Number or Rounds"
                        type="number"
                        fullWidth
                        value={section.number_of_rounds}
                        onChange={handleChange('number_of_rounds')}
                    />

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
