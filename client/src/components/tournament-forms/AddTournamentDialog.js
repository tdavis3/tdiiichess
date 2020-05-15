import React, {useState} from 'react'

import AddIcon from '@material-ui/icons/Add'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import IconButton from '@material-ui/core/IconButton'
import PropTypes from 'prop-types'
import TextField from '@material-ui/core/TextField'
import Tooltip from '@material-ui/core/Tooltip'
import {connect} from "react-redux";
import {createTournament} from "../../actions/tournaments";

const initialTournament = {
    tournamentname: "",
    printingname: "",
    timecontrol: ""
};

const AddTournamentDialog = props => {
    const [tournament, setTournament] = useState(initialTournament);
    const {createTournament} = props;

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
                    <AddIcon/>
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
                        value={tournament.tournamentname}
                        onChange={handleChange('tournamentname')}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Printing Name"
                        type="text"
                        fullWidth
                        value={tournament.printingname}
                        onChange={handleChange('printingname')}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Time Control"
                        type="text"
                        fullWidth
                        value={tournament.timecontrol}
                        onChange={handleChange('timecontrol')}
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

AddTournamentDialog.propTypes = {
    createTournament: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({});

export default connect(mapStateToProps, {createTournament})(AddTournamentDialog);
