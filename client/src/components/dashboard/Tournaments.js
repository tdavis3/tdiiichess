import React, {useEffect, useMemo, useState} from "react";
import {Link} from "react-router-dom";

import {
    Box,
    Grid,
    Typography,
    Container, IconButton, Tooltip
} from "@material-ui/core";
import CssBaseline from '@material-ui/core/CssBaseline';
import makeStyles from "@material-ui/core/styles/makeStyles";
import {red, green, yellow} from '@material-ui/core/colors';
import DonutLargeIcon from '@material-ui/icons/DonutLarge';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import AssignmentIcon from "@material-ui/icons/Assignment";
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';

import {dateRenderer} from "../../utils/helpers";
import SnackbarAlert from "../layout/SnackbarAlert";
import TournamentTable from "../tables/TournamentTable";
import EditTournamentDialog from "../forms/tournament/EditTournamentDialog";
import DeleteTournamentDialog from "../forms/tournament/DeleteTournamentDialog";

import PropTypes from "prop-types";
import {connect} from "react-redux";
import {setAlert} from "../../actions/alert";
import {getTournaments, duplicateTournament} from "../../actions/tournaments";

import copy from "copy-to-clipboard";
import MainDrawer from "../layout/MainDrawer";

let moment = require('moment');
moment().format();


const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
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
    }
}));


const Tournaments = ({tournaments, duplicateTournament, getTournaments}) => {
    useEffect(() => {
        if (tournaments.tournaments.length !== 0) {
            return;  // Do not want to keep reloading unnecessarily
        }
        getTournaments();
    }, []);

    const classes = useStyles();

    const initialCopyClipboardToolTipText = "Copy ID";
    const [copyClipboardText, setCopyClipboardText] = useState(initialCopyClipboardToolTipText);

    const handleCopyClipboardToolTipClose = () => {
        setCopyClipboardText(initialCopyClipboardToolTipText);
    };

    const handleCopyToClipboard = (tournamentId) => () => {
        copy(tournamentId);
        setCopyClipboardText("Copied!");
    };

    const handleDuplicateTournament = (tournamentId) => () => {
        duplicateTournament(tournamentId);
    }

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
                Header: 'Time Control',
                accessor: 'timeControl',
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
                id: 'duration',
                accessor: 'startDate',
                Cell: ({cell: {row: {original: {startDate, endDate}}}}) => {
                    return (dateRenderer(startDate, endDate));
                },
                sortType: (a, b) => {  // Date Comparison function
                    const x = new Date(a);
                    const y = new Date(b);
                    return x === y ? 0 : x > y ? 1 : -1
                }
            },
            {
                Header: 'Status',
                id: 'status',
                accessor: 'startDate',
                // minWidth: 150,
                Cell: ({cell}) => {
                    // TODO Do this calculation server-side; Add "status field" to Tournament model
                    const today = moment();
                    const start = moment(cell.row.original.startDate).startOf('day');
                    const end = moment(cell.row.original.endDate).endOf('day');
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
                                <Tooltip title={copyClipboardText} onClose={handleCopyClipboardToolTipClose}>
                                    <IconButton aria-label="copy"
                                                onClick={handleCopyToClipboard(cell.row.original.SK)}>
                                        <AssignmentIcon fontSize={"small"}/>
                                    </IconButton>
                                </Tooltip>
                            </Grid>
                            <Grid item xs={3}>
                                <Tooltip title={"Duplicate"}>
                                    <IconButton aria-label="duplicate"
                                                onClick={handleDuplicateTournament(cell.row.original.tournamentId)}>
                                        <FileCopyIcon fontSize={"small"}/>
                                    </IconButton>
                                </Tooltip>
                            </Grid>
                            <Grid item xs={3}>
                                <EditTournamentDialog selectedTournament={cell.row.original}/>
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
        return tournaments.tournaments;
    }, [tournaments.tournaments]);

    return (
        <div className={classes.root}>
            <CssBaseline/>
            <MainDrawer>
                <Box className={classes.box}>
                    <Typography className={classes.center}>Welcome!</Typography>
                </Box>
            </MainDrawer>
            <main className={classes.content}>
                <Container>
                    <TournamentTable
                        title={"Tournaments"}
                        columns={columns}
                        data={data}
                    />
                    <SnackbarAlert/>
                </Container>
            </main>
        </div>
    );
};

Tournaments.propTypes = {
    setAlert: PropTypes.func.isRequired,
    getTournaments: PropTypes.func.isRequired,
    duplicateTournament: PropTypes.func.isRequired,
    tournaments: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    tournaments: state.tournaments
});

export default connect(mapStateToProps, {
    setAlert,
    getTournaments,
    duplicateTournament
})(Tournaments);
