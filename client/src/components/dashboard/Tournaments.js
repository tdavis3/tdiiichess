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
import List from "@material-ui/core/List";
import Drawer from "@material-ui/core/Drawer";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import {Box} from "@material-ui/core";

const drawerWidth = 220;

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
    },
    appBar: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    // necessary for content to be below app bar
    toolbar: theme.mixins.toolbar,
    content: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.default,
        padding: theme.spacing(3),
    },
    logo: {
        width: '60px',
        // float: 'left',
        // marginLeft: theme.spacing(3),
    }
}));

const Tournaments = props => {
    useEffect(() => {
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
                Header: 'Time Control',
                accessor: 'timecontrol',
            },
            {
                Header: 'Sections',
                accessor: 'sectionids',
                Cell: ({cell: {value}}) => {
                    return (
                        <>{value.length}</>
                    );
                }
            },
            {
                Header: 'Date',
                accessor: 'date',
                Cell: ({cell: {value}}) => {
                    return (
                        <Moment format="MM/DD/YYYY">{value}</Moment>
                    );
                },
                sortType: (a, b) => {  // Date Comparison function
                    const x = new Date(a);
                    const y = new Date(b);
                    return x === y ? 0 : x > y ? 1 : -1
                }
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
                <div className={classes.toolbar}>
                    <Box component={Link} to={'/'}>
                        <img className={classes.logo} src={require("../../img/kchess_logosvg.svg")} alt="KCHESS logo"/>
                    </Box>
                </div>
                <Divider/>
                <List>
                    <ListItem button>
                        <ListItemText primary={"Tournaments"}/>
                    </ListItem>
                </List>
                <Divider/>
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
