import React, {useEffect, useState} from "react";

import makeStyles from "@material-ui/core/styles/makeStyles";
import {
    CssBaseline,
    Box,
    List,
    ListItem,
    ListItemText,
    Dialog,
    DialogTitle,
    Button,
    Typography,
    Tab,
    Tabs
} from '@material-ui/core';
import PropTypes from "prop-types";
import {connect} from "react-redux";


function TabPanel(props) {
    const {children, value, index, ...other} = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3}>
                    {children}
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
    },
    gridVerticalCenter: {
        display: "flex",
        alignItems: "center"
    }
}));


const ByesDialog = ({selectedSectionId, selectedSectionIndex, players, sections}) => {
    const classes = useStyles();

    useEffect(() => {
        setByesPlayers();
    }, [selectedSectionIndex, sections]);

    const [tabIndex, setTabIndex] = useState(0);
    const [open, setOpen] = useState(false);

    const [playersWithBye, setPlayersWithBye] = useState([]);
    const [activePlayers, setActivePlayers] = useState([]);
    const [summary, setSummary] = useState([]);

    const roundInByes = (roundNumber, byes) => {
        for (const bye of byes) {
            if (bye.round_number === roundNumber) {
                return true;
            }
        }
        return false;
    };

    const setByesPlayers = () => {
        const tempActivePlayers = [];
        const tempPlayersWithBye = [];
        const tempSummary = [];
        if (!sections.loading) {
            if (!(sections.sections.length === 0) && (selectedSectionId in players.players)) {
                const currentRound = sections.sections[selectedSectionIndex].currentRound;
                players.players[selectedSectionId].forEach(player => {
                    const listOfByes = player.byes;
                    if (roundInByes(currentRound + 1, listOfByes)) {
                        tempPlayersWithBye.push(player.SK);
                    } else {
                        tempActivePlayers.push(player.SK);
                    }
                    if (listOfByes.length > 0) {
                        tempSummary.push(player.SK);
                    }
                });
            }
        }
        setPlayersWithBye(tempPlayersWithBye);
        setActivePlayers(tempActivePlayers);
        setSummary(tempSummary);
    };

    const handleClickOpen = () => {
        setOpen(true)
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleChange = (event, newIndex) => {
        setTabIndex(newIndex);
    };

    return (
        <div className={classes.root}>
            <CssBaseline/>
            <Button size={"small"} onClick={handleClickOpen}>
                Byes
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
                fullWidth
                maxWidth={"sm"}
                scroll={"paper"}
                aria-labelledby="form-dialog-title"
            >
                <DialogTitle id="form-dialog-title">Byes</DialogTitle>
                <Tabs
                    value={tabIndex}
                    onChange={handleChange}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="fullWidth"
                >
                    <Tab label="Players with a bye" {...a11yProps(0)}/>
                    <Tab label="Active Players" {...a11yProps(1)}/>
                    <Tab label="Summary" {...a11yProps(2)}/>
                </Tabs>
                <TabPanel value={tabIndex} index={0}>
                    <Typography align={"center"}>Players inactive for next round</Typography>
                    <List>
                        {playersWithBye.map((player, index) => (
                            <ListItem button data-index={index} key={index}>
                                <ListItemText
                                    primary={player.firstName.concat(" ", player.lastName, " ", player.suffix)}/>
                            </ListItem>
                        ))}
                    </List>
                </TabPanel>
                <TabPanel value={tabIndex} index={1}>
                    <Typography align={"center"}>Players active for next round</Typography>
                    <List>
                        {activePlayers.map((player, index) => (
                            <ListItem button data-index={index} key={index}>
                                <ListItemText
                                    primary={player.firstName.concat(" ", player.lastName, " ", player.suffix)}/>
                            </ListItem>
                        ))}
                    </List>
                </TabPanel>
                <TabPanel value={tabIndex} index={2}>
                    <Typography align={"center"}>All players with byes</Typography>
                    <List>
                        {summary.map((player, index) => (
                            <ListItem button data-index={index} key={index}>
                                <ListItemText
                                    primary={player.firstName.concat(" ", player.lastName, " ", player.suffix)}/>
                            </ListItem>
                        ))}
                    </List>
                </TabPanel>
            </Dialog>
        </div>
    );
};

ByesDialog.propTypes = {
    selectedSectionId: PropTypes.string.isRequired,
    selectedSectionIndex: PropTypes.number.isRequired,
    players: PropTypes.object.isRequired,
    sections: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    players: state.players,
    sections: state.sections
});

export default connect(mapStateToProps, null)(ByesDialog);
