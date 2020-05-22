import React, {Fragment} from "react";
import PropTypes from "prop-types";
import {Link} from "react-router-dom";
import {connect} from "react-redux";
import {generatePairings} from "../../actions/resultpairings";
import {Toolbar} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
    toolbar: {
        borderBottom: `1px solid ${theme.palette.divider}`,
    },
    toolbarTitle: {
        flex: 1,
    },
    toolbarSecondary: {
        justifyContent: 'space-between',
        overflowX: 'auto',
        backgroundColor: 'white',
        borderBottom: `1px solid ${theme.palette.divider}`,
    },
    toolbarLink: {
        padding: theme.spacing(1),
        flexShrink: 0,
    },
}));

const SectionDashNavbar = props => {
    const classes = useStyles();
    const section = props.currentsection;
    return (
        <Fragment>
            <Toolbar component="nav" variant="dense" className={classes.toolbarSecondary}>
                <Link
                    color="inherit"
                    noWrap
                    // key={section.title}
                    variant="body2"
                    // href={section.url}
                    to={{
                        pathname: "/tournaments/sections/dashboard",
                        state: {section}
                    }}
                    className={classes.toolbarLink}
                >
                    Section Dashboard
                </Link>
                <Link
                    color="inherit"
                    noWrap
                    variant="body2"
                    to={{
                        pathname: "/tournaments/sections/resultpairings",
                        state: {section}
                    }}
                    className={classes.toolbarLink}
                >
                    Pairings
                </Link>
                <Link
                    color="inherit"
                    noWrap
                    variant="body2"
                    to={{
                        pathname: "/tournaments/sections/standings",
                        state: {section}
                    }}
                    className={classes.toolbarLink}
                >
                    Standings
                </Link>
            </Toolbar>
        </Fragment>
    );
};

SectionDashNavbar.propTypes = {
    generatePairings: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
    sections: state.resultpairings
});

export default connect(mapStateToProps, {
    generatePairings
})(SectionDashNavbar);
