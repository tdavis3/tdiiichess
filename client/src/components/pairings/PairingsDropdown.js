import React, {useRef, useState} from "react";
import {
    Button,
    ClickAwayListener,
    Grow,
    MenuItem,
    MenuList,
    Paper,
    Popper
} from "@material-ui/core";
import PropTypes from "prop-types";
import {makeStyles} from "@material-ui/core/styles";
import {connect} from "react-redux";
import {generatePairings} from "../../actions/resultpairings";


const useStyles = makeStyles((theme) => ({
        menu: {
            alignItems: 'center'
        },
        infoText: {
            padding: theme.spacing(1)
        }
    }
));

const PairingsDropdown = ({selectedSectionIndex, currentSectionId, players, sections, generatePairings}) => {
    const classes = useStyles();

    const anchorRef = useRef(null);
    const [open, setOpen] = useState(false);

    const handleClick = () => {  // User can only move one player at a time
        setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }
        setOpen(false);
    };

    function handleListKeyDown(event) {
        if (event.key === 'Tab') {
            event.preventDefault();
            setOpen(false);
        }
    }

    const handlePairNextRound = () => {
        // Check that all results have been entered for the section
        generatePairings(currentSectionId, sections.sections[selectedSectionIndex].current_round, players);
        setOpen(false);
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
                    Pairings
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
                                    <MenuList autoFocusItem={open} id="menu-list-grow"
                                              onKeyDown={handleListKeyDown}>
                                        <MenuItem onClick={handlePairNextRound}>Pair next round</MenuItem>
                                    </MenuList>
                                </ClickAwayListener>
                            </Paper>
                        </Grow>
                    )}
                </Popper>
            </div>
        </div>
    );
}

PairingsDropdown.propTypes = {
    selectedSectionIndex: PropTypes.number.isRequired,
    currentSectionId: PropTypes.string.isRequired,
    players: PropTypes.array.isRequired,
    sections: PropTypes.object.isRequired,
    generatePairings: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    sections: state.sections
});

export default connect(mapStateToProps, {generatePairings})(PairingsDropdown);
