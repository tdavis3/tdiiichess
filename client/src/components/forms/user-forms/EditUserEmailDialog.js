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
import isEmail from 'validator/lib/isEmail';

import PropTypes from 'prop-types';
import {connect} from "react-redux";
import {change_email} from "../../../actions/account";


const EditUserEmailDialog = ({auth, change_email}) => {

    const initial_form = {
        new_email: "",
        confirm_new_email: ""
    };

    const [formData, setFormData] = useState(initial_form);

    const [errorData, setErrorData] = useState({
        emails_match: true,
        valid_email: false
    });

    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true)
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSave = () => {
        if (errorData.emails_match && errorData.valid_email) {
            change_email(auth.user.email, formData.new_email);
            setOpen(false);
            setFormData(initial_form);
        }
    };

    const handleChange = name => ({target: {value}}) => {
        setFormData({...formData, [name]: value});

        let newErrorData = {
            emails_match: null,
            valid_email: errorData.valid_email
        };

        if (name === 'new_email') {
            newErrorData.valid_email = isEmail(value);
            newErrorData.emails_match = (value === formData.confirm_new_email);
        } else if (name === 'confirm_new_email') {
            newErrorData.emails_match = (value === formData.new_email);
        }
        setErrorData(newErrorData);
    };

    return (
        <div>
            <Tooltip title="Change email">
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
                        value={formData.new_email}
                        onChange={handleChange('new_email')}
                        error={!errorData.valid_email}
                        helperText={errorData.valid_email ? "" : "Not a valid email format"}
                    />
                    <TextField
                        variant={"outlined"}
                        autoFocus
                        margin="dense"
                        label="Re-enter your new email"
                        type="text"
                        fullWidth
                        value={formData.confirm_new_email}
                        onChange={handleChange('confirm_new_email')}
                        error={!errorData.emails_match}
                        helperText={errorData.emails_match ? "" : "Does not match email"}
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
    change_email: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});


export default connect(mapStateToProps, {change_email})(EditUserEmailDialog);
