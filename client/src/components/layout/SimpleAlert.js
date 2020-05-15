import React from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {makeStyles} from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';


const SimpleAlert = ({alerts}) => {
    return (
        alerts !== null &&
        alerts.length > 0 &&
        alerts.map(alert => (
            // <div
            //     key={alert.id}
            //     className={`alert alert-${alert.alertType}`}
            //     role="alert"
            // >
            //     {alert.msg}
            // </div>
            <div key={alert.id}>
                <Alert severity={`${alert.alertType}`}>{alert.msg}</Alert>
                {/*<Alert severity="error">{alert.msg}</Alert>*/}
            </div>
        )));
};

SimpleAlert.propTypes = {
    alerts: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
    alerts: state.alert
});

export default connect(mapStateToProps)(SimpleAlert);
