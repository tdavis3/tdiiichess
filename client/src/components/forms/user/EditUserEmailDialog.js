import React, {useState} from 'react';

import {
    Tooltip,
    TextField,
    Button,
    IconButton,
    Dialog,
    DialogTitle,
    DialogActions,
    DialogContent,
} from "@material-ui/core";
import EditIcon from '@material-ui/icons/Edit';

import {allTruthy, isValidEmail} from "../../../utils/helpers";

import PropTypes from 'prop-types';
import {connect} from "react-redux";
import {changeEmail} from "../../../actions/account";
import Config from "../../../config/default";
import {validate} from "@material-ui/pickers";


const EditUserEmailDialog = ({auth, changeEmail}) => {

    const initialForm = {
        new_email: "",
        confirmNewEmail: ""
    };

    const initialErrorState = {
        display: false,
        validEmail: false,
        emailsMatch: true
    };

    const [formData, setFormData] = useState(initialForm);

    const [errorData, setErrorData] = useState(initialErrorState);

    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true)
    };

    const handleClose = () => {
        setOpen(false);
        setFormData(initialForm);
        setErrorData(initialErrorState);
    };

    const validateFields = () => {
        let newErrorData = {};
        newErrorData.validEmail = isValidEmail(formData.new_email);
        newErrorData.emailsMatch = (formData.new_email === formData.confirmNewEmail && formData.new_email !== "");
        if (!allTruthy(newErrorData)) {
            newErrorData.display = true;
            setErrorData(newErrorData);
            return false;
        }
        return true;
    };

    const handleSave = () => {
        if (validateFields()) {
            changeEmail(auth.user.email, formData.new_email);
            setOpen(false);
            setFormData(initialForm);
        }
    };

    const handleChange = e => {
        setFormData({...formData, [e.target.id]: e.target.value});
    };

    return (
        <div>
            <Tooltip title="Edit email">
                <IconButton aria-label="edit" onClick={handleClickOpen}>
                    <EditIcon fontSize={"small"}/>
                </IconButton>
            </Tooltip>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="form-dialog-title"
            >
                <DialogTitle id="form-dialog-title">Change Email</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Old email"
                        type="text"
                        fullWidth
                        defaultValue={auth.user.email}
                        variant={"outlined"}
                        disabled={true}
                    />
                    <TextField
                        variant={"outlined"}
                        autoFocus
                        margin="dense"
                        label="New email"
                        type="text"
                        fullWidth
                        id="new_email"
                        value={formData.new_email}
                        onChange={handleChange}
                        error={!errorData.validEmail && errorData.display}
                        helperText={!errorData.validEmail ? "Not a valid email format." : ""}
                    />
                    <TextField
                        variant={"outlined"}
                        autoFocus
                        margin="dense"
                        label="Re-enter your new email"
                        type="text"
                        fullWidth
                        id="confirmNewEmail"
                        value={formData.confirmNewEmail}
                        onChange={handleChange}
                        error={!errorData.emailsMatch && errorData.display}
                        helperText={!errorData.emailsMatch && errorData.display ? "Emails do not match." : ""}
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

EditUserEmailDialog.propTypes = {
    changeEmail: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});


export default connect(mapStateToProps, {changeEmail})(EditUserEmailDialog);
