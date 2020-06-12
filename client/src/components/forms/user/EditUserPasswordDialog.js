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


const EditUserPasswordDialog = ({auth, changePassword}) => {

    const initial_form = {
        old_password: "",
        new_password: "",
        confirm_new_password: ""
    };

    const [formData, setFormData] = useState(initial_form);

    const [errorData, setErrorData] = useState({
        passwordsMatch: true
    });

    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true)
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSave = () => {
        /*
        TODO: Check length of password - Better error UI - maybe list of requirements (red) and as they are satisfied
          (green)
         */
        if (errorData.passwordsMatch) {
            changePassword(auth.user._id, formData.old_password, formData.new_password);
            setOpen(false);
            setFormData(initial_form);
        }
    };

    const handleChange = name => ({target: {value}}) => {
        setFormData({...formData, [name]: value});
        if (name === 'new_password') {
            setErrorData({...errorData, passwordsMatch: (value === formData.confirm_new_password)})
        } else if (name === 'confirm_new_password') {
            setErrorData({...errorData, passwordsMatch: (value === formData.new_password)})
        }
    };

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
                        value={formData.old_password}
                        onChange={handleChange('old_password')}
                        required
                    />
                    <TextField
                        variant={"outlined"}
                        autoFocus
                        margin="dense"
                        label="New password"
                        helperText="Your password must be 8-20 characters long."
                        type={"password"}
                        fullWidth
                        value={formData.new_password}
                        onChange={handleChange('new_password')}
                    />
                    <TextField
                        variant={"outlined"}
                        autoFocus
                        margin="dense"
                        label="Re-enter your new password"
                        type={"password"}
                        fullWidth
                        value={formData.confirm_new_password}
                        onChange={handleChange('confirm_new_password')}
                        error={!errorData.passwordsMatch}
                        helperText={errorData.passwordsMatch ? "" : "Passwords do not match."}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={(!errorData.passwordsMatch)} color="primary">
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
