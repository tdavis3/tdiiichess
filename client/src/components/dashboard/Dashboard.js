import React, {useEffect} from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {getCurrentSections} from "../../actions/sections";
import {Link} from "react-router-dom";
import CssBaseline from "@material-ui/core/CssBaseline";
import EnhancedTable from "../layout/EnhancedTable";
import AddSectionDialog from "../tournament-forms/AddSectionDialog";
import EditSectionDialog from "../tournament-forms/EditSectionDialog";
import Drawer from "@material-ui/core/Drawer";
import DrawerHeader from "../layout/DrawerHeader";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import makeStyles from "@material-ui/core/styles/makeStyles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import {deletePlayer} from "../../actions/players";
import Grid from "@material-ui/core/Grid";
import AddPlayerDialog from "../tournament-forms/AddPlayerDialog";

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

const Dashboard = props => {
    useEffect(() => {
        props.getCurrentSections(props.location.state.tourney._id);
    }, []);

    const classes = useStyles();

    // const [open, setOpen] = React.useState(false);
    //
    // const handleClickOpen = () => {
    //     setOpen(true)
    // };
    //
    // const handleClose = () => {
    //     setOpen(false);
    // };

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
                accessor: 'event_type',
            },
            {
                Header: 'Time Control',
                accessor: 'time_control',
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

    console.log(props.sections.sections);

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

                <Grid container spacing={2}>
                    // Or textAlign: right
                    <Grid item xs={5} style={{display: 'flex', alignItems: 'center', justifyContent: 'right'}}>
                        <Typography className={classes.center}>Sections</Typography>
                    </Grid>
                    <Grid item xs={3}>
                        <AddSectionDialog/>
                    </Grid>
                </Grid>

                <List component="nav" aria-label="secondary mailbox folders">
                    {props.sections.sections.map((section, index) => (
                        <ListItem button>
                            <ListItemText primary={section.name}/>
                        </ListItem>
                    ))}
                </List>
            </Drawer>

            <main className={classes.content}>
                <EnhancedTable
                    title={'Players'}
                    parent_id={props.location.state.tourney._id}
                    columns={columns}
                    data={data}
                    deleteaction={props.deletePlayer}
                    CreateDialog={AddPlayerDialog}
                    EditDialog={EditSectionDialog}
                />
            </main>
        </div>
    );
};

Dashboard.propTypes = {
    getCurrentSections: PropTypes.func.isRequired,
    deletePlayer: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    sections: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
    sections: state.sections
});

export default connect(mapStateToProps, {
    getCurrentSections,
    deletePlayer,
})(Dashboard);
