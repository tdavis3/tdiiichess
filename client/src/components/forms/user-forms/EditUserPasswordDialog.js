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
import {change_password} from "../../../actions/account";


const EditUserPasswordDialog = ({auth, change_password}) => {

    const initial_form = {
        old_password: "",
        new_password: "",
        confirm_new_password: ""
    };

    const [formData, setFormData] = useState(initial_form);

    const [errorData, setErrorData] = useState({
        passwords_match: true
    });

    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true)
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSave = () => {
        if (errorData.passwords_match) {
            change_password(auth.user._id, formData.old_password, formData.new_password);
            setOpen(false);
            setFormData(initial_form);
        }
    };

    const handleChange = name => ({target: {value}}) => {
        setFormData({...formData, [name]: value});

        let newErrorData = {
            passwords_match: null
        };

        if (name === 'new_password') {
            newErrorData.passwords_match = (value === formData.confirm_new_password);
        } else if (name === 'confirm_new_password') {
            newErrorData.passwords_match = (value === formData.new_password);
        }
        setErrorData(newErrorData);
    };

    return (
        <div>
            <Tooltip title="Change password">
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
                        error={!errorData.passwords_match}
                        helperText={errorData.passwords_match ? "" : "Passwords do not match."}
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
    change_password: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps, {change_password})(EditUserPasswordDialog);
