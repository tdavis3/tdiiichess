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
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import DonutLargeIcon from '@material-ui/icons/DonutLarge';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import {Grid} from "@material-ui/core";
import {red, green, yellow} from '@material-ui/core/colors';

let moment = require('moment');
moment().format();

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
                        <Link to={{pathname: "/tournaments/dashboard", state: {tourney}}}>
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
                Cell: ({cell: {value}}) => {
                    if (value == null || value === '') {
                        return (
                            <>--</>
                        );
                    } else {
                        return (
                            <>{value}</>
                        );
                    }
                }
            },
            {
                Header: 'Date',
                accessor: 'date',
                Cell: props => {
                    return (
                        <div>
                            <Moment
                                format="MM/DD/YYYY">{props.cell.row.original.start_date}</Moment> - <Moment
                            format="MM/DD/YYYY">{props.cell.row.original.end_date}</Moment>
                        </div>
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
                Cell: props => {
                    // TODO Do this calculation server-side; Add "status field" to Tournament model
                    const today = moment();
                    const start = moment(props.cell.row.original.start_date);
                    const end = moment(props.cell.row.original.end_date);
                    if (today.isBefore(start)) {
                        return (
                            <Grid container spacing={1}>
                                <Grid item xs={3}>
                                    <FiberManualRecordIcon style={{color: red[500]}}/>
                                </Grid>
                                <Grid item xs={3}>
                                    <Typography>Not started</Typography>
                                </Grid>
                            </Grid>
                        );
                    } else if (today.isBetween(start, end)) {
                        return (
                            <Grid container spacing={1}>
                                <Grid item xs={3}>
                                    <DonutLargeIcon style={{color: yellow[500]}}/>
                                </Grid>
                                <Grid item xs={3}>
                                    <Typography>In progress</Typography>
                                </Grid>
                            </Grid>
                        );

                    } else if (today.isAfter(end)) {
                        return (
                            <Grid container spacing={1}>
                                <Grid item xs={3}>
                                    <CheckCircleOutlineIcon style={{color: green[500]}}/>
                                </Grid>
                                <Grid item xs={3}>
                                    <Typography>Completed</Typography>
                                </Grid>
                            </Grid>);
                    } else {
                        return null
                    }
                },
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
