import React from 'react';
import {Link} from "react-router-dom";

import {
    CssBaseline,
    MenuItem,
    IconButton,
    Box,
    Grid,
    Typography,
    Popper,
    Grow,
    Paper,
    ClickAwayListener,
    MenuList
} from "@material-ui/core";
import MenuIcon from '@material-ui/icons/Menu';
import {makeStyles} from '@material-ui/core/styles';

import PropTypes from "prop-types";
import {connect} from "react-redux";
import {logout} from "../../actions/auth";

const useStyles = makeStyles(theme => ({
    root: {
        // display: 'flex',
        padding: theme.spacing(1)
    },
    logo: {
        textAlign: 'center',
        fontSize: 25,
        marginBottom: 5
    },
    user: {
        fontSize: 14,
    },
    menu: {
        // display: 'flex',
        alignItems: 'center'
    },
}));

const DrawerHeader = ({auth, logout}) => {
    const classes = useStyles();

    const [open, setOpen] = React.useState(false);
    const anchorRef = React.useRef(null);

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

    // return focus to the button when we transitioned from !open -> open
    const prevOpen = React.useRef(open);
    React.useEffect(() => {
        if (prevOpen.current === true && open === false) {
            anchorRef.current.focus();
        }

        prevOpen.current = open;
    }, [open]);

    return (
        <Box className={classes.root}>
            <CssBaseline/>
            <div className={classes.logo}>
                <Typography>TDIII Chess</Typography>
            </div>
            <Grid container spacing={2}>
                <Grid item xs={9}>
                    <Typography
                        className={classes.user} noWrap>{auth.user.first_name} {auth.user.last_name}</Typography>
                    <Typography className={classes.user} noWrap>{auth.user.email}</Typography>
                </Grid>
                <Grid item xs={3} className={classes.menu}>
                    <IconButton
                        ref={anchorRef}
                        aria-controls={open ? 'menu-list-grow' : undefined}
                        aria-haspopup="true"
                        onClick={handleToggle}
                    >
                        <MenuIcon fontSize={"medium"}/>
                    </IconButton>
                    <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
                        {({TransitionProps, placement}) => (
                            <Grow
                                {...TransitionProps}
                                style={{transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom'}}
                            >
                                <Paper>
                                    <ClickAwayListener onClickAway={handleClose}>
                                        <MenuList autoFocusItem={open} id="menu-list-grow"
                                                  onKeyDown={handleListKeyDown}>
                                            <MenuItem component={Link} to={'/account'}
                                                      onClick={handleClose}>Profile</MenuItem>
                                            <MenuItem onClick={logout}>Logout</MenuItem>
                                        </MenuList>
                                    </ClickAwayListener>
                                </Paper>
                            </Grow>
                        )}
                    </Popper>
                </Grid>
            </Grid>
        </Box>
    );
}

DrawerHeader.propTypes = {
    logout: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps, {logout})(DrawerHeader);
