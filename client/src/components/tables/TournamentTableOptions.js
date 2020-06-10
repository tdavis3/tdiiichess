import React, {useRef, useState} from "react";

import {
    Grow,
    Paper,
    Popper,
    MenuList,
    MenuItem,
    IconButton,
    ClickAwayListener,
} from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import {makeStyles} from "@material-ui/core/styles";


const useStyles = makeStyles((theme) => ({
        menu: {
            // display: 'flex',
            alignItems: 'center'
        },
    }
));

const TournamentTableOptions = () => {
    const classes = useStyles();

    const [open, setOpen] = useState(false);
    const anchorRef = useRef(null);

    const handleToggle = () => {
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

    return (
        <div className={classes.menu}>
            <IconButton
                ref={anchorRef}
                aria-controls={open ? 'menu-list-grow' : undefined}
                aria-haspopup="true"
                onClick={handleToggle}
            >
                <MoreVertIcon/>
            </IconButton>
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
                                    <MenuItem onClick={handleClose}>Help</MenuItem>
                                </MenuList>
                            </ClickAwayListener>
                        </Paper>
                    </Grow>
                )}
            </Popper>
        </div>
    );
}

export default TournamentTableOptions;
