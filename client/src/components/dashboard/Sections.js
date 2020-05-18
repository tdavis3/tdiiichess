import React, {useEffect} from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {getCurrentSections, deleteSection} from "../../actions/sections";
import {Link} from "react-router-dom";
import CssBaseline from "@material-ui/core/CssBaseline";
import EnhancedTable from "../layout/EnhancedTable";
import AddSectionDialog from "../tournament-forms/AddSectionDialog";
import EditSectionDialog from "../tournament-forms/EditSectionDialog";
import Drawer from "@material-ui/core/Drawer";
import DrawerHeader from "../layout/DrawerHeader";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import AddTournamentDialog from "../tournament-forms/AddTournamentDialog";
import EditTournamentDialog from "../tournament-forms/EditTournamentDialog";
import makeStyles from "@material-ui/core/styles/makeStyles";

const drawerWidth = 260;

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0
    },
    drawerPaper: {
        width: drawerWidth,
    },
    drawerContainer: {
        overflow: 'auto',
    },
    toolbar: theme.mixins.toolbar,
    content: {
        // flexGrow: 1,
        // backgroundColor: theme.palette.background.default,
        // padding: theme.spacing(3),
    },
    logo: {
        width: '60px',
    },
    center: {
        textAlign: 'center',
        fontSize: 18
    }
}));

const Sections = props => {
    useEffect(() => {
        props.getCurrentSections(props.location.state.tourney._id);
    }, []);

    const classes = useStyles();

    const columns = React.useMemo(
        () => [
            {
                Header: 'Name',
                accessor: 'name',
                Cell: ({cell}) => {
                    const value = cell.value;
                    const section = cell.row.original;
                    return (
                        <Link to={{pathname: "/tournaments/sections/dashboard", state: {section}}}>
                            {value}
                        </Link>
                    );
                }
            },
            {
                Header: 'Event Type',
                accessor: 'eventtype',
            },
            {
                Header: 'Time Control',
                accessor: 'timecontrol',
            },
            {
                Header: 'Players',
                accessor: 'players',
                Cell: ({cell: {value}}) => {
                    return (
                        <>{value.length}</>
                    );
                }
            },
        ],
        []
    );

    const data = React.useMemo(() => props.sections.sections, [props.sections.sections]);

    return (
        <div className={classes.root}>
            <CssBaseline/>
            <Drawer
                className={classes.drawer}
                variant="permanent"
                classes={{
                    paper: classes.drawerPaper,
                }}
                anchor="left"
            >
                <DrawerHeader
                    first_name={props.auth.user.first_name}
                    last_name={props.auth.user.last_name}
                    email={props.auth.user.email}
                />
                <Divider/>
                <Typography className={classes.center}>Tournament Info</Typography>
                <Typography>{props.location.state.tourney.name}</Typography>
                <Divider/>
                <Typography className={classes.center}>Sections</Typography>

            </Drawer>

            <main className={classes.content}>
                <EnhancedTable
                    title={'Sections'}
                    parent_id={props.location.state.tourney._id}
                    columns={columns}
                    data={data}
                    deleteaction={props.deleteSection}
                    CreateDialog={AddSectionDialog}
                    EditDialog={EditSectionDialog}
                />
            </main>
        </div>
    );
};

Sections.propTypes = {
    getCurrentSections: PropTypes.func.isRequired,
    deleteSection: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    sections: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
    sections: state.sections
});

export default connect(mapStateToProps, {
    getCurrentSections,
    deleteSection,
})(Sections);
