import React, {useState} from 'react';

import {
    Tooltip,
    TextField,
    Button,
    IconButton,
    Select,
    Input,
    InputLabel,
    Dialog,
    DialogTitle,
    DialogActions,
    DialogContent,
    DialogContentText
} from "@material-ui/core";
import EditIcon from '@material-ui/icons/Edit';

import PropTypes from 'prop-types';
import {connect} from "react-redux";
import {editSection} from "../../../actions/sections";

const EditSectionDialog = ({editSection, selected_edit}) => {

    const originalSection = {
        name: selected_edit.name,
        printing_name: selected_edit.printing_name,
        event_type: selected_edit.event_type,
        style: selected_edit.style,
        rating_type: selected_edit.rating_type,
        coin_toss: selected_edit.coin_toss,
        time_control: selected_edit.time_control,
        number_of_rounds: selected_edit.number_of_rounds
    };

    const [section, setSection] = useState(originalSection);

    // Any change to the state vis call to setOpen() will re-render the component
    // Closing the modal for example
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true)
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSave = () => {
        editSection(selected_edit._id, section);
        setOpen(false);
    };

    const handleChange = name => ({target: {value}}) => {
        setSection({...section, [name]: value})  // Will re-render component
    };

    return (
        <div>
            <Tooltip title="Add">
                <IconButton aria-label="add" onClick={handleClickOpen}>
                    <EditIcon/>
                </IconButton>
            </Tooltip>
            <Dialog
                open={open}
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
    editSection: PropTypes.func.isRequired,
};

export default connect(null, {editSection})(EditSectionDialog);
