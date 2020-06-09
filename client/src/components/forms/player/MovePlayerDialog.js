import React, {useState} from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Grid,
    Typography
} from "@material-ui/core";
import Popover from "@material-ui/core/Popover";
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
        popoverContent: {
            padding: theme.spacing(1)
        }
    }
));

const MovePlayerDialog = ({selectedRowIds, players, sections, oldSectionId, movePlayer}) => {
    const classes = useStyles();

    const movingPlayerInitial = {
        first_name: "",
        last_name: "",
        state: "",
        uscf_reg_rating: "",
        uscf_id: ""
    };

    const [anchorEl, setAnchorEl] = useState(null);
    const [displayOpen, setDisplayOpen] = useState(null);
    const [movingPlayerInfo, setMovingPlayerInfo] = useState(movingPlayerInitial);
    const [sectionDisplayedIndex, setSectionDisplayedIndex] = useState(0);

    const handleSectionClick = (index) => () => {
        setSectionDisplayedIndex(index);
    };

    const handleClick = (event) => {  // User can only move one player at a time
        const numberOfSelectedPlayers = Object.keys(selectedRowIds).length;
        if (numberOfSelectedPlayers === 0 || numberOfSelectedPlayers > 1) {
            setAnchorEl(event.currentTarget);  // Display popover
        } else if (numberOfSelectedPlayers === 1) {
            // Display MovePlayer modal
            setDisplayOpen(true);
            const selectedIndex = parseInt(Object.keys(selectedRowIds)[0], 10);
            setMovingPlayerInfo(players[selectedIndex].player_id);  // Get the data at the selected index
        }
    };

    const handleClose = () => {
        setAnchorEl(null);
        setDisplayOpen(false);
    };

    const handleMove = () => {
        const selectedIndex = parseInt(Object.keys(selectedRowIds)[0], 10);
        const newSectionId = sections.sections[sectionDisplayedIndex]._id;
        movePlayer(oldSectionId, players[selectedIndex], newSectionId);
        handleClose();
    };

    const popoverOpen = Boolean(anchorEl);
    const id = popoverOpen ? 'move-popover' : undefined;

    return (
        <div>
            <Button size={"small"} aria-describedby={id} onClick={handleClick}>
                Move
            </Button>
            <Popover
                id={id}
                open={popoverOpen}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
            >
                <Typography className={classes.popoverContent}>Select a player to move.</Typography>
            </Popover>

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
                                    <Typography>{movingPlayerInfo.first_name.concat(" ", movingPlayerInfo.last_name)}</Typography>
                                    <Grid container spacing={2}>
                                        <Grid item xs={3}>
                                            <Typography>{movingPlayerInfo.state}</Typography>
                                        </Grid>
                                        <Grid item xs={7}>
                                            <Typography>{movingPlayerInfo.uscf_reg_rating}</Typography>
                                        </Grid>
                                    </Grid>
                                    <Typography>{movingPlayerInfo.uscf_id}</Typography>
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
    players: PropTypes.array.isRequired,
    sections: PropTypes.object.isRequired,
    oldSectionId: PropTypes.string.isRequired,
    movePlayer: PropTypes.func.isRequired
};

export default connect(null, {movePlayer})(MovePlayerDialog);
