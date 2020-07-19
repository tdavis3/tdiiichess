import React, {useRef, useState} from "react";
import {
    Button, ClickAwayListener,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Grid,
    Grow,
    Paper,
    Popper,
    Typography
} from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import PropTypes from "prop-types";
import {makeStyles} from "@material-ui/core/styles";
import {connect} from "react-redux";
import {movePlayer} from "../../../actions/players";


const useStyles = makeStyles((theme) => ({
        menu: {
            alignItems: 'center'
        },
        infoText: {
            padding: theme.spacing(1)
        }
    }
));

const MovePlayerDialog = ({selectedRowIds, players, sections, currentSectionId, movePlayer}) => {
    const classes = useStyles();

    const movingPlayerInitial = {
        firstName: "",
        lastName: "",
        state: "",
        uscfRegRating: "",
        uscfId: ""
    };

    const anchorRef = useRef(null);
    const [open, setOpen] = useState(false);
    const [displayOpen, setDisplayOpen] = useState(false);
    const [movingPlayerInfo, setMovingPlayerInfo] = useState(movingPlayerInitial);
    const [sectionDisplayedIndex, setSectionDisplayedIndex] = useState(0);

    const handleSectionClick = (index) => () => {
        setSectionDisplayedIndex(index);
    };

    const handleClick = () => {  // User can only move one player at a time
        const numberOfSelectedPlayers = Object.keys(selectedRowIds).length;
        if (numberOfSelectedPlayers === 0 || numberOfSelectedPlayers > 1) {
            setOpen((prevOpen) => !prevOpen);
        } else if (numberOfSelectedPlayers === 1) {
            // Display MovePlayer modal
            setDisplayOpen(true);
            const selectedIndex = parseInt(Object.keys(selectedRowIds)[0], 10);
            setMovingPlayerInfo(players.players[selectedIndex].SK);  // Get the data at the selected index
        }
    };

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }
        setDisplayOpen(false);
        setOpen(false);
    };

    const handleMove = () => {
        const selectedIndex = parseInt(Object.keys(selectedRowIds)[0], 10);
        const newSectionId = sections.sections[sectionDisplayedIndex].SK;
        movePlayer(currentSectionId, players.players[selectedIndex], newSectionId);
        handleClose();
    };

    return (
        <div>
            <div className={classes.menu}>
                <Button
                    ref={anchorRef}
                    aria-haspopup="true"
                    size={"small"}
                    onClick={handleClick}
                >
                    Move
                </Button>
                <Popper style={{zIndex: 2}} open={open} anchorEl={anchorRef.current} role={undefined} transition
                        disablePortal>
                    {({TransitionProps, placement}) => (
                        <Grow
                            {...TransitionProps}
                            style={{transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom'}}
                        >
                            <Paper>
                                <ClickAwayListener onClickAway={handleClose}>
                                    <Typography className={classes.infoText}>Select a player to move</Typography>
                                </ClickAwayListener>
                            </Paper>
                        </Grow>
                    )}
                </Popper>
            </div>

            <Dialog
                fullWidth={true}
                maxWidth={'sm'}
                open={displayOpen}
                onClose={handleClose}
                aria-labelledby="form-dialog-title"
            >
                <DialogTitle id="form-dialog-title">Move Player</DialogTitle>
                <DialogContent>
                    <DialogContentText>Pick the target section.</DialogContentText>
                    <Grid container spacing={3}>
                        <Grid item xs={4}>
                            <Card>
                                <CardContent>
                                    <Typography>{movingPlayerInfo.firstName.concat(" ", movingPlayerInfo.lastName)}</Typography>
                                    <Grid container spacing={2}>
                                        <Grid item xs={3}>
                                            <Typography>{movingPlayerInfo.state}</Typography>
                                        </Grid>
                                        <Grid item xs={7}>
                                            <Typography>{movingPlayerInfo.uscfRegRating}</Typography>
                                        </Grid>
                                    </Grid>
                                    <Typography>{movingPlayerInfo.uscfId}</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={6}>
                            <List component="nav" aria-label="target-sections">
                                {sections.sections.map((section, index) => (
                                    <ListItem button selected={sectionDisplayedIndex === index} data-index={index}
                                              key={index} onClick={handleSectionClick(index)}>
                                        <ListItemText primary={section.name}/>
                                    </ListItem>
                                ))}
                            </List>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleMove} color="primary">
                        Move
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

MovePlayerDialog.propTypes = {
    selectedRowIds: PropTypes.object.isRequired,
    players: PropTypes.object.isRequired,
    sections: PropTypes.object.isRequired,
    currentSectionId: PropTypes.string.isRequired,
    movePlayer: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    players: state.players,
    sections: state.sections
});

export default connect(mapStateToProps, {movePlayer})(MovePlayerDialog);
