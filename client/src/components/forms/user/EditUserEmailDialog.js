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
import {changeEmail} from "../../../actions/account";


const EditUserEmailDialog = ({auth, changeEmail}) => {

    const initial_form = {
        new_email: "",
        confirm_new_email: ""
    };

    const [formData, setFormData] = useState(initial_form);

    const [errorData, setErrorData] = useState({
        emailsMatch: true,
        validEmail: false
    });

    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true)
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSave = () => {
        if (errorData.emailsMatch && errorData.validEmail) {
            changeEmail(auth.user.email, formData.new_email);
            setOpen(false);
            setFormData(initial_form);
        }
    };

    const handleChange = name => ({target: {value}}) => {
        setFormData({...formData, [name]: value});
        if (name === 'new_email') {
            setErrorData({
                ...errorData,
                validEmail: isEmail(value),
                emailsMatch: (value === formData.confirm_new_email)
            })
        } else if (name === 'confirm_new_email') {
            setErrorData({...errorData, emailsMatch: (value === formData.new_email)})
        }
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
                        value={formData.new_email}
                        onChange={handleChange('new_email')}
                        error={!errorData.validEmail}
                        helperText={errorData.validEmail ? "" : "Not a valid email format."}
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
                        error={!errorData.emailsMatch}
                        helperText={errorData.emailsMatch ? "" : "Emails do not match."}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={(!(errorData.emailsMatch && errorData.validEmail))}
                            color="primary">
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
