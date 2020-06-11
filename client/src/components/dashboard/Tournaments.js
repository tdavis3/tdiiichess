import React, {useEffect, useMemo} from "react";
import {Link} from "react-router-dom";

import CssBaseline from '@material-ui/core/CssBaseline';
import makeStyles from "@material-ui/core/styles/makeStyles";
import {Box, Grid, Drawer, Divider, Typography, Container} from "@material-ui/core";
import {red, green, yellow} from '@material-ui/core/colors';
import DonutLargeIcon from '@material-ui/icons/DonutLarge';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';

import Spinner from "../layout/Spinner";
import DrawerHeader from "../layout/DrawerHeader";
import TournamentTable from "../tables/TournamentTable";
import EditTournamentDialog from "../forms/tournament/EditTournamentDialog";
import DeleteTournamentDialog from "../forms/tournament/DeleteTournamentDialog";

import PropTypes from "prop-types";
import {connect} from "react-redux";
import {setAlert} from "../../actions/alert";
import {getCurrentTournaments} from "../../actions/tournaments";
import Skeleton from "@material-ui/lab/Skeleton";
import SnackbarAlert from "../layout/SnackbarAlert";

let moment = require('moment');
moment().format();

const drawerWidth = 260;

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
    },
    drawer: {
        display: "inline-block",
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
    logo: {
        width: '60px',
    },
    center: {
        textAlign: 'center',
        fontSize: 18
    },
    box: {
        padding: theme.spacing(1)
    },
    content: {
        flexGrow: 1,
        height: '100vh',
        // overflow: 'auto',
    },
    container: {
        // paddingTop: theme.spacing(4),
        // paddingBottom: theme.spacing(4),
    },
}));


const Tournaments = ({getCurrentTournaments, tournaments, auth}) => {
    useEffect(() => {
        getCurrentTournaments();
    }, []);

    const classes = useStyles();

    const columns = useMemo(
        () => [
            {
                Header: 'Name',
                accessor: 'name',
                // minWidth: 150,
                // maxWidth: 300,
                Cell: ({cell: {value, row}}) => {
                    const tournament = row.original;
                    return (
                        <Link to={{pathname: "/tournaments/dashboard", state: {tournament}}}>
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
                Cell: ({cell: {row: {original: {start_date, end_date}}}}) => {
                    const start = moment(start_date);
                    const end = moment(end_date);
                    return (
                        start.isSame(end) ?
                            start.format("MM/DD/YYYY") :
                            start.format("MM/DD/YYYY").concat(" - ", end.format("MM/DD/YYYY"))

                    )
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
                // minWidth: 150,
                Cell: ({cell}) => {
                    // TODO Do this calculation server-side; Add "status field" to Tournament model
                    const today = moment();
                    const start = moment(cell.row.original.start_date).startOf('day');
                    const end = moment(cell.row.original.end_date).endOf('day');
                    let status = '';
                    let icon = null;
                    if (today.isBefore(start)) {
                        status = 'Not started';
                        icon = <FiberManualRecordIcon fontSize={"small"} style={{color: red[500]}}/>;
                    } else if (today.isBetween(start, end)) {
                        status = 'In progress';
                        icon = <DonutLargeIcon fontSize={"small"} style={{color: yellow[500]}}/>;
                    } else if (today.isAfter(end)) {
                        status = 'Completed';
                        icon = <CheckCircleIcon fontSize={"small"} style={{color: green[500]}}/>;
                    } else {
                        return null;
                    }
                    return (
                        <Grid container spacing={1}>
                            <Grid item xs={3}>
                                {icon}
                            </Grid>
                            <Grid item xs={9}>
                                <Typography>{status}</Typography>
                            </Grid>
                        </Grid>);
                },
            },
            {
                Header: '',
                accessor: ' ',
                // width: 150,
                Cell: ({cell}) => (
                    <div>
                        <Grid container spacing={2}>
                            <Grid item xs={3}>
                                <EditTournamentDialog selected_edit={cell.row.original}/>
                            </Grid>
                            <Grid item xs={3}>
                                <DeleteTournamentDialog tournament={cell.row.original}/>
                            </Grid>
                        </Grid>
                    </div>
                ),
            }
        ],
        []
    );

    const data = useMemo(() => {
        if (tournaments.loading) {
            return [];
        } else {
            if (tournaments.tournaments.length === 0) {
                return [];
            } else {
                return tournaments.tournaments;
            }
        }
    }, [tournaments.loading, tournaments.tournaments]);

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
                    first_name={auth.user.first_name}
                    last_name={auth.user.last_name}
                    email={auth.user.email}
                />
                <Divider/>
                <Box className={classes.box}>
                    <Typography className={classes.center}>Welcome!</Typography>
                </Box>
            </Drawer>
            <main className={classes.content}>
                <Container className={classes.container}>
                    {tournaments.loading ? (
                        <Spinner/>
                    ) : (
                        <TournamentTable
                            title={"Tournaments"}
                            columns={columns}
                            data={data}
                        />
                    )}
                    <SnackbarAlert/>
                </Container>
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
    getCurrentTournaments
})(Tournaments);
