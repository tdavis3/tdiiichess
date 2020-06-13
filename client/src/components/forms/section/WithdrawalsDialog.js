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
    Button
} from '@material-ui/core';
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
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


const WithdrawalsDialog = ({selectedSectionIndex, sections}) => {
    const classes = useStyles();

    useEffect(() => {
        setWithdrawalPlayers();
    }, [selectedSectionIndex, sections]);

    const [tabIndex, setTabIndex] = useState(0);
    const [open, setOpen] = useState(false);
    const [activePlayers, setActivePlayers] = useState([]);
    const [inactivePlayers, setInactivePlayers] = useState([]);

    const setWithdrawalPlayers = () => {
        const tempActivePlayers = [];
        const tempInactivePlayers = [];
        if (!sections.loading) {
            if (!(sections.sections.length === 0)) {
                sections.sections[selectedSectionIndex].players.forEach(player => {
                    if (player.withdrew) {
                        tempInactivePlayers.push(player.player_id);
                    } else {
                        tempActivePlayers.push(player.player_id);
                    }
                });
            }
        }
        setActivePlayers(tempActivePlayers);
        setInactivePlayers(tempInactivePlayers);
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
                Withdrawals
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
                fullWidth
                maxWidth={"sm"}
                scroll={"paper"}
                aria-labelledby="form-dialog-title"
            >
                <DialogTitle id="form-dialog-title">Withdrawals</DialogTitle>
                <Tabs
                    value={tabIndex}
                    onChange={handleChange}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="fullWidth"
                >
                    <Tab label="Active Players" {...a11yProps(0)}/>
                    <Tab label="Inactive Players" {...a11yProps(1)}/>
                </Tabs>
                <TabPanel value={tabIndex} index={0}>
                    <List>
                        {activePlayers.map((activePlayer, index) => (
                            <ListItem button data-index={index} key={index}>
                                <ListItemText
                                    primary={activePlayer.first_name.concat(" ", activePlayer.last_name, " ", activePlayer.suffix)}/>
                            </ListItem>
                        ))}
                    </List>
                </TabPanel>
                <TabPanel value={tabIndex} index={1}>
                    <List>
                        {inactivePlayers.map((inactivePlayer, index) => (
                            <ListItem button data-index={index} key={index}>
                                <ListItemText
                                    primary={inactivePlayer.first_name.concat(" ", inactivePlayer.last_name, " ", inactivePlayer.suffix)}/>
                            </ListItem>
                        ))}
                    </List>
                </TabPanel>
            </Dialog>
        </div>
    );
};

WithdrawalsDialog.propTypes = {
    selectedSectionIndex: PropTypes.number.isRequired,
    sections: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    sections: state.sections
});

export default connect(mapStateToProps, null)(WithdrawalsDialog);
