import React, {useState} from 'react';

import AddIcon from '@material-ui/icons/Add';
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

const initialSection = {
    sectionname: "",
    printingname: "",
    eventtype: "Regular Swiss",
    style: "Regular",
    ratingtype: "Regular/Standard",
    cointoss: "--",
    timecontrol: "",
    numberofrounds: 1
};

const AddSectionDialog = props => {
    const [section, setSection] = useState(initialSection);
    const {createSection, parent_id} = props;

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
                    <AddIcon/>
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
                        value={section.sectionname}
                        onChange={handleChange('sectionname')}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Printing Name"
                        type="text"
                        fullWidth
                        value={section.printingname}
                        onChange={handleChange('printingname')}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Time Control"
                        type="text"
                        fullWidth
                        value={section.timecontrol}
                        onChange={handleChange('timecontrol')}
                    />
                    <InputLabel htmlFor="eventtype">Event Type</InputLabel>
                    <Select
                        native
                        value={section.eventtype}
                        onChange={handleChange('eventtype')}
                        input={<Input id="eventtype"/>}
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

                    <InputLabel htmlFor="ratingtype">Rating Type</InputLabel>
                    <Select
                        native
                        value={section.ratingtype}
                        onChange={handleChange('ratingtype')}
                        input={<Input id="ratingtype"/>}
                    >
                        <option value="Regular/Standard">Regular/Standard</option>
                        <option value="Quick/Rapid">Quick/Rapid</option>
                        <option value="Blitz">Blitz</option>
                    </Select>

                    <InputLabel htmlFor="cointoss">Coin Toss</InputLabel>
                    <Select
                        native
                        value={section.cointoss}
                        onChange={handleChange('cointoss')}
                        input={<Input id="cointoss"/>}
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
                        value={section.numberofrounds}
                        onChange={handleChange('numberofrounds')}
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

AddSectionDialog.propTypes = {
    createSection: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({});

export default connect(mapStateToProps, {createSection})(AddSectionDialog);
