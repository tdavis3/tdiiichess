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

import PropTypes from 'prop-types';
import {connect} from "react-redux";
import {changePassword} from "../../../actions/account";
import Config from "../../../config/default";
import {allTruthy} from "../../../utils/helpers";


const EditUserPasswordDialog = ({auth, changePassword}) => {

    const initialForm = {
        old_password: "",
        new_password: "",
        confirmNewPassword: ""
    };

    const initialErrorState = {
        display: false,
        passwordValidLength: false,
        passwordsMatch: true
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
        newErrorData.passwordValidLength = (formData.new_password.length >= Config.validMinPasswordLength && formData.new_password.length <= Config.validMaxPasswordLength);
        newErrorData.passwordsMatch = (formData.new_password === formData.confirmNewPassword && formData.new_password !== "");
        if (!allTruthy(newErrorData)) {
            newErrorData.display = true;
            setErrorData(newErrorData);
            return false;
        }
        return true;
    };

    const handleSave = () => {
        if (validateFields()) {
            changePassword(auth.user._id, formData.old_password, formData.new_password);
            setOpen(false);
            setFormData(initialForm);
        }
    };

    const handleChange = e => {
        setFormData({...formData, [e.target.id]: e.target.value});
        if (e.target.id === 'new_password') {
            setErrorData({...errorData, passwordsMatch: (e.target.value === formData.confirmNewPassword)})
        } else if (e.target.id === 'confirm_new_password') {
            setErrorData({...errorData, passwordsMatch: (e.target.value === formData.new_password)})
        }
    }

    return (
        <div>
            <Tooltip title="Edit password">
                <IconButton aria-label="edit" onClick={handleClickOpen}>
                    <EditIcon fontSize={"small"}/>
                </IconButton>
            </Tooltip>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="form-dialog-title"
            >
                <DialogTitle id="form-dialog-title">Change Password</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Old password"
                        fullWidth
                        variant={"outlined"}
                        type={"password"}
                        id="old_password"
                        value={formData.old_password}
                        onChange={handleChange}
                        required
                    />
                    <TextField
                        variant={"outlined"}
                        autoFocus
                        margin="dense"
                        label="New password"
                        type={"password"}
                        fullWidth
                        id="new_password"
                        value={formData.new_password}
                        onChange={handleChange}
                        error={!errorData.passwordValidLength && errorData.display}
                        helperText={"Must be 8-20 characters."}
                    />
                    <TextField
                        variant={"outlined"}
                        autoFocus
                        margin="dense"
                        label="Re-enter your new password"
                        type={"password"}
                        fullWidth
                        id="confirmNewPassword"
                        value={formData.confirmNewPassword}
                        onChange={handleChange}
                        error={!errorData.passwordsMatch && errorData.display}
                        helperText={!errorData.passwordsMatch && errorData.display ? "Passwords do not" +
                            " match." : ""}
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

EditUserPasswordDialog.propTypes = {
    changePassword: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps, {changePassword})(EditUserPasswordDialog);
