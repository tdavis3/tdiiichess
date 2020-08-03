import React, {useState} from "react";
import {Link} from "react-router-dom";

import {
    AppBar,
    Toolbar,
    IconButton,
    Button,
    Container,
    MenuItem,
    Menu,
    Box
} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';

import PropTypes from "prop-types";
import {connect} from "react-redux";

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
    },
    navbar: {
        marginBottom: theme.spacing(2)
    },
    grow: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    sectionDesktop: {
        display: 'none',
        [theme.breakpoints.up('md')]: {
            display: 'flex',
        },
    },
    sectionMobile: {
        display: 'flex',
        [theme.breakpoints.up('md')]: {
            display: 'none',
        },
    },
    logo: {
        width: '120px',
        height: '30px',
        float: 'left',
        marginLeft: theme.spacing(3),
    }
}));

const Navbar = ({auth}) => {

    const classes = useStyles();

    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);

    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
    };

    const handleMobileMenuOpen = event => {
        setMobileMoreAnchorEl(event.currentTarget);
    };

    const navLinks = (
        <Container>
            <Button href="/">
                Home
            </Button>
            <Button href="/register">
                Register
            </Button>
            <Button href="/login">
                Login
            </Button>
        </Container>
    );

    const mobileMenuId = 'primary-search-account-menu-mobile';

    const menuLinks = (
        <Container>
            <MenuItem component={Link} to={'/'}>
                Home
            </MenuItem>
            <MenuItem component={Link} to={'/register'}>
                Register
            </MenuItem>
            <MenuItem component={Link} to={'/login'}>
                Login
            </MenuItem>
        </Container>
    );

    const renderMobileMenu = (
        <Menu
            anchorEl={mobileMoreAnchorEl}
            anchorOrigin={{vertical: 'top', horizontal: 'right'}}
            id={mobileMenuId}
            keepMounted
            transformOrigin={{vertical: 'top', horizontal: 'right'}}
            open={isMobileMenuOpen}
            onClose={handleMobileMenuClose}
        >
            {!auth.loading && (
                <div>
                    {menuLinks}
                </div>
            )}
        </Menu>
    );

    return (
        <div className={classes.root}>
            <AppBar position="fixed" color={"inherit"} style={{boxShadow: 'none'}}>
                <Toolbar>
                    <Box component={Link} to={'/'}>
                        <img className={classes.logo} src={require("../../img/tdiii_chess_logo.png")}
                             alt="TDIII Chess logo"/>
                    </Box>
                    <div className={classes.grow}/>
                    <div className={classes.sectionDesktop}>
                        <div>
                            {navLinks}
                        </div>
                    </div>
                    <div className={classes.sectionMobile}>
                        <IconButton
                            aria-label="show more"
                            aria-controls={mobileMenuId}
                            aria-haspopup="true"
                            onClick={handleMobileMenuOpen}
                            color="inherit"
                        >
                            <MenuIcon/>
                        </IconButton>
                    </div>
                </Toolbar>
            </AppBar>
            <Toolbar/> {/* To prevent the AppBar from covering up the main page content */}
            {renderMobileMenu}
        </div>
    );
};

Navbar.propTypes = {
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps)(Navbar);
