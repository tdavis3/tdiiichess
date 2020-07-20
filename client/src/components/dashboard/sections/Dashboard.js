import React, {useEffect, useState, useMemo} from "react";

import {
    Grid,
    Divider,
    Typography,
    Container
} from "@material-ui/core";
import CssBaseline from '@material-ui/core/CssBaseline';
import makeStyles from "@material-ui/core/styles/makeStyles";

import MainDrawer from "../../layout/MainDrawer";
import SnackbarAlert from "../../layout/SnackbarAlert";
import DashboardTable from "../../tables/DashboardTable";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {getSections} from "../../../actions/sections";

import TournamentInfo from "./TournamentInfo";
import SectionsList from "./SectionsList";
import {stripPrefix} from "../../../utils/helpers";
import {getPlayers} from "../../../actions/players";

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
        height: '100vh'
    },
    popoverContent: {
        padding: theme.spacing(1)
    }
}));

const Dashboard = ({
                       getPlayers,
                       getSections,
                       players,
                       sections,
                       location
                   }) => {
    const tournament = location.state.tournament;
    const tournamentId = stripPrefix(tournament.SK);
    useEffect(() => {
        getSections(tournamentId).then(firstSectionId => {
            if (firstSectionId !== "undefined") {
                getPlayers(tournamentId, firstSectionId);
            }
        });
    }, []);

    const classes = useStyles();

    const [sectionDisplayedIndex, setSectionDisplayedIndex] = useState(0);
    let selectedSectionId = (sections.loading || sections.sections.length === 0) ? "" : stripPrefix(sections.sections[sectionDisplayedIndex].SK);

    const columns = useMemo(
        () => [
            {
                Header: 'Player',
                accessor: 'SK',
                width: 150,
                minWidth: 150,
                maxWidth: 150,
                // collapse: true,
                Cell: ({cell: {row: {original: {firstName, lastName, suffix, uscfId, uscfRegRating}}}}) => {
                    return (
                        <Grid container spacing={2} direction={'column'}>
                            <Grid item xs={5} md={3}>
                                <Typography>{firstName.concat(" ", lastName, " ", suffix)}</Typography>
                            </Grid>
                            <Grid item xs={5} container>
                                <Grid item xs={4} md={3}>
                                    <Typography>{uscfId}</Typography>
                                </Grid>
                                <Grid item xs={2}>
                                    <Typography>{uscfRegRating}</Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                    );
                }
            }
        ],
        []
    );

    return (
        <div className={classes.root}>
            <CssBaseline/>
            <MainDrawer>
                <TournamentInfo tournament={tournament}/>
                <Divider/>
                <SectionsList
                    tournament={tournament}
                    sectionDisplayedIndex={sectionDisplayedIndex}
                    setSectionDisplayedIndex={setSectionDisplayedIndex}
                />
            </MainDrawer>
            <main className={classes.content}>
                {/* TODO Put Dashboard Toolbar here (so user can see something and spinner placed underneath)*/}
                <Container className={classes.container}>
                    <DashboardTable
                        tournament={tournament}
                        selectedSectionIndex={sectionDisplayedIndex}
                        sectionId={selectedSectionId}
                        columns={columns}
                        data={players.players[selectedSectionId] || []}
                    />
                    <SnackbarAlert/>
                </Container>
            </main>
        </div>
    );
};

Dashboard.propTypes = {
    getPlayers: PropTypes.func.isRequired,
    getSections: PropTypes.func.isRequired,
    players: PropTypes.object.isRequired,
    sections: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    players: state.players,
    sections: state.sections
});

export default connect(mapStateToProps, {getPlayers, getSections})(Dashboard);
