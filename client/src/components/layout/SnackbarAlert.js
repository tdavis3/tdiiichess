import React, {useEffect, useState} from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import Alert from '@material-ui/lab/Alert';
import Snackbar from "@material-ui/core/Snackbar";
import {clearAlert} from "../../actions/alert";


const SnackbarAlert = ({alert, clearAlert}) => {

    useEffect(
        () => {
            setDisplaySnackbar(alert.display)
        }, [alert.display]
    );

    const [displaySnackbar, setDisplaySnackbar] = useState(alert.display);

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setDisplaySnackbar(false);
        clearAlert();
    };

    return (
        <div>
            {
                alert.display ? (
                    <div key={alert.id}>
                        <Snackbar open={displaySnackbar} autoHideDuration={5000} onClose={handleSnackbarClose}>
                            <Alert onClose={handleSnackbarClose}
                                   severity={`${alert.alertType}`}>
                                {alert.msg}
                            </Alert>
                        </Snackbar>
                    </div>
                ) : (
                    <></>
                )
            }
        </div>
    );
};

SnackbarAlert.propTypes = {
    alert: PropTypes.object.isRequired,
    clearAlert: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    alert: state.alert
});

export default connect(mapStateToProps, {clearAlert})(SnackbarAlert);
