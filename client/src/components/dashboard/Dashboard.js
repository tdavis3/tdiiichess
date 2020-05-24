import React, {useEffect, useState} from "react";

import CssBaseline from '@material-ui/core/CssBaseline';
import makeStyles from "@material-ui/core/styles/makeStyles";
import Moment from "react-moment";
import {Box, Grid, Drawer, Divider, List, ListItem, ListItemText, Typography} from "@material-ui/core";

import Spinner from "../layout/Spinner";
import DrawerHeader from "../layout/DrawerHeader";
import DashboardTable from "../tables/DashboardTable";
import AddSectionDialog from "../tournament-forms/AddSectionDialog";

import PropTypes from "prop-types";
import {connect} from "react-redux";
import {getCurrentSections} from "../../actions/sections";

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
    logo: {
        width: '60px',
    },
    center: {
        textAlign: 'center',
        fontSize: 18
    },
    box: {
        padding: theme.spacing(1)
    }
}));

const Dashboard = ({
                       getCurrentSections,
                       auth,
                       sections,
                       location
                   }) => {

    useEffect(() => {
        getCurrentSections(location.state.tourney._id);
    }, []);

    const classes = useStyles();

    const [sectionDisplayedIndex, setSectionDisplayedIndex] = useState(0);

    const handleSectionClick = (index) => () => {
        setSectionDisplayedIndex(index);
    };

    const columns = React.useMemo(
        () => [
            {
                Header: 'Player',
                accessor: 'player_id',
                Cell: ({cell: {value: {first_name, last_name, suffix, uscf_id, uscf_reg_rating}}}) => {
                    return (
                        <Grid container spacing={1}>
                            <Grid item xs={10}>
                                <Typography>{first_name.concat(" ", last_name, " ", suffix)}</Typography>
                            </Grid>
                            <Grid item xs={5}>
                                <Typography>{uscf_id}</Typography>
                            </Grid>
                            <Grid item xs={3}>
                                <Typography>{uscf_reg_rating}</Typography>
                            </Grid>
                        </Grid>
                    );
                }
            }
        ],
        []
    );

    const data = React.useMemo(() => {
        if (sections.loading) {
            return [];
        } else {
            if (sections.sections.length === 0) {
                return [];
            } else {
                return sections.sections[sectionDisplayedIndex].players;
            }
        }
    }, [sectionDisplayedIndex, sections.loading, sections.sections]);

    const date_renderer = (start_date, end_date) => {
        const start = moment(start_date);
        const end = moment(end_date);
        return (
            <Typography>
                Date:{" "}
                {
                    start.isSame(end) ? (<Moment format="MM/DD/YYYY">{start_date}</Moment>) :
                        (<Moment format="MM/DD/YYYY">{start_date}</Moment> -
                            <Moment format="MM/DD/YYYY">{end_date}</Moment>)
                }
            </Typography>
        );
    };

    const tournament_status = (start_date, end_date) => {
        const today = moment();
        const start = moment(start_date);
        const end = moment(end_date);
        if (today.isBefore(start)) {
            return 'Not started';
        } else if (today.isBetween(start, end)) {
            return 'In progress';
        } else if (today.isAfter(end)) {
            return 'Completed';
        }
    };

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
                    <Typography className={classes.center}>Tournament Info</Typography>
                    <Typography>Name: {location.state.tourney.name}</Typography>
                    {date_renderer(location.state.tourney.start_date, location.state.tourney.end_date)}
                    <Typography>Status: {tournament_status(location.state.tourney.start_date, location.state.tourney.end_date)}</Typography>
                </Box>
                <Divider/>

                <Grid container spacing={1} justify={'center'}>
                    <Grid item xs={3} style={{display: 'flex', alignItems: 'center'}}>
                        <Typography style={{fontSize: 18}}>Sections</Typography>
                    </Grid>
                    <Grid item xs={2}>
                        <AddSectionDialog
                            parent_id={location.state.tourney._id}
                            tournament_time_control={location.state.tourney.time_control}
                        />
                    </Grid>
                </Grid>

                <List component="nav" aria-label="secondary mailbox folders">
                    {sections.sections.map((section, index) => (
                        <ListItem button selected={sectionDisplayedIndex === index} data-index={index} key={index}
                                  onClick={handleSectionClick(index)}>
                            <ListItemText primary={section.name}/>
                        </ListItem>
                    ))}
                </List>
            </Drawer>
            <main>
                {/* TODO Put Dashboard Toolbar here (so user can see something and spinner placed underneath)*/}
                {sections.loading ? (<Spinner/>) : (
                    <DashboardTable
                        parent_id={location.state.tourney.section_ids[sectionDisplayedIndex]}
                        columns={columns}
                        data={data}
                    />
                )}
            </main>
        </div>
    );
};

Dashboard.propTypes = {
    getCurrentSections: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    sections: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
    sections: state.sections
});

export default connect(mapStateToProps, {
    getCurrentSections
})(Dashboard);
