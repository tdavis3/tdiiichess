import React, {Fragment} from "react";
import {Link} from "react-router-dom";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import {logout} from "../../actions/auth";
import {makeStyles} from '@material-ui/core/styles';
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
import MenuIcon from '@material-ui/icons/Menu';

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
        width: '60px',
        float: 'left',
        marginLeft: theme.spacing(3),
    }
}));

const Navbar = props => {

    const classes = useStyles();

    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
    };

    const handleMobileMenuOpen = event => {
        setMobileMoreAnchorEl(event.currentTarget);
    };

    const guestLinks = (
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

    const authLinks = (
        <Container>
            <Button href="/tournaments">
                Tournaments
            </Button>
            <Button href="/account">
                Account
            </Button>
            <Button href="/" onClick={props.logout}>
                Sign Out
            </Button>
        </Container>
    );

    const mobileMenuId = 'primary-search-account-menu-mobile';

    const guestmenuLinks = (
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

    const authmenuLinks = (
        <Container>
            <MenuItem component={Link} to={'/tournaments'}>
                Tournaments
            </MenuItem>
            <MenuItem component={Link} to={'/account'}>
                Account
            </MenuItem>
            <MenuItem component={Link} to={'/'} onClick={props.logout}>
                Sign Out
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
            {!props.auth.loading && (
                <Fragment>
                    {props.auth.isAuthenticated ? authmenuLinks : guestmenuLinks}
                </Fragment>
            )}
        </Menu>
    );

    return (
        <div className={classes.root}>
            <AppBar position="fixed" color={"inherit"}>
                <Toolbar>
                    <Box component={Link} to={'/'}>
                        <img className={classes.logo} src={require("../../img/kchess_logosvg.svg")} alt="KCHESS logo"/>
                    </Box>
                    <div className={classes.grow}/>
                    <div className={classes.sectionDesktop}>
                        {!props.auth.loading && (
                            <Fragment>
                                {props.auth.isAuthenticated ? authLinks : guestLinks}
                            </Fragment>
                        )}
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
    logout: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps, {logout})(Navbar);
