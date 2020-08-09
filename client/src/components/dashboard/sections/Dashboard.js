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
                       getSections,
                       sections,
                       location
                   }) => {
    const tournament = location.state.tournament;
    useEffect(() => {
        getSections(tournament.SK);
    }, []);

    const classes = useStyles();

    const [sectionDisplayedIndex, setSectionDisplayedIndex] = useState(0);
    let selectedSectionId = (sections.loading || sections.sections.length === 0) ? "" : stripPrefix(sections.sections[sectionDisplayedIndex].SK);

    const columns = useMemo(
        () => [
            {
                Header: 'Player',
                accessor: d => `${d.firstName} ${d.lastName} ${d.suffix}`,
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
                    />
                    <SnackbarAlert/>
                </Container>
            </main>
        </div>
    );
};

Dashboard.propTypes = {
    getSections: PropTypes.func.isRequired,
    sections: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    sections: state.sections
});

export default connect(mapStateToProps, {getSections})(Dashboard);
