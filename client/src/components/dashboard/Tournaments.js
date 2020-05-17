import React, {useEffect} from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import Moment from "react-moment";
import {setAlert} from "../../actions/alert";
import {
    deleteTournament,
    getCurrentTournaments,
} from "../../actions/tournaments";
import {Link} from "react-router-dom";

import CssBaseline from '@material-ui/core/CssBaseline';
import EnhancedTable from "../layout/EnhancedTable";
import AddTournamentDialog from '../tournament-forms/AddTournamentDialog';
import EditTournamentDialog from "../tournament-forms/EditTournamentDialog";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import DrawerHeader from "../layout/DrawerHeader";
import Typography from "@material-ui/core/Typography";
import store from "../../store";
import {loadUser} from "../../actions/auth";

const drawerWidth = 260;

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
    },
    // appBar: {
    //     width: `calc(100% - ${drawerWidth}px)`,
    //     marginLeft: drawerWidth,
    // },
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

const Tournaments = props => {
    useEffect(() => {
        // store.dispatch(loadUser());
        props.getCurrentTournaments();
    }, []);

    const classes = useStyles();

    const columns = React.useMemo(
        () => [
            {
                Header: 'Name',
                accessor: 'name',
                Cell: ({cell}) => {
                    const value = cell.value;
                    const tourney = cell.row.original;
                    return (
                        <Link to={{pathname: "/tournaments/sections", state: {tourney}}}>
                            {value}
                        </Link>
                    );
                }
            },
            {
                Header: 'Sections',
                accessor: 'section_ids',
                Cell: ({cell: {value}}) => {
                    return (
                        <>{value.length}</>
                    );
                }
            },
            {
                Header: 'Time Control',
                accessor: 'time_control',
            },
            {
                Header: 'Date',
                accessor: 'date',
                Cell: props => {
                    // console.log(props);
                    return (
                        <Moment format="MM/DD/YYYY">{props.original.start_date}</Moment> -
                        <Moment format="MM/DD/YYYY">{props.original.end_date}</Moment>
                    );
                },
                sortType: (a, b) => {  // Date Comparison function
                    const x = new Date(a);
                    const y = new Date(b);
                    return x === y ? 0 : x > y ? 1 : -1
                }
            },
            {
                Header: 'Status',
                accessor: 'start_date',
            },
        ],
        []
    );

    const data = React.useMemo(() => props.tournaments.tournaments, [props.tournaments.tournaments]);

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
                <Typography className={classes.center}>Welcome!</Typography>
            </Drawer>

            <main className={classes.content}>
                <EnhancedTable
                    title={"Tournaments"}
                    columns={columns}
                    data={data}
                    deleteaction={props.deleteTournament}
                    CreateDialog={AddTournamentDialog}
                    EditDialog={EditTournamentDialog}
                />
            </main>
        </div>
    );
};

Tournaments.propTypes = {
    setAlert: PropTypes.func.isRequired,
    getCurrentTournaments: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    tournaments: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
    tournaments: state.tournaments
});

export default connect(mapStateToProps, {
    setAlert,
    getCurrentTournaments,
    deleteTournament
})(Tournaments);
