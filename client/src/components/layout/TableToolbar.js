import React from 'react'

import {
    Tooltip,
    Toolbar,
    Typography,
    IconButton
} from "@material-ui/core";
import clsx from 'clsx';
import DeleteIcon from '@material-ui/icons/Delete';
import {lighten, makeStyles} from '@material-ui/core/styles';

import PropTypes from 'prop-types';


const useToolbarStyles = makeStyles(theme => ({
    root: {
        // paddingLeft: theme.spacing(1.5),
        // paddingRight: theme.spacing(1),
        // backgroundColor: 'white',
        // position: 'fixed',
        // zIndex: 5
    },
    highlight:
        theme.palette.type === 'light'
            ? {
                color: theme.palette.secondary.main,
                backgroundColor: lighten(theme.palette.secondary.light, 0.85),
            }
            : {
                color: theme.palette.text.primary,
                backgroundColor: theme.palette.secondary.dark,
            },
    title: {
        flex: '1 1 100%',
    },
}));

const TableToolbar = ({title, numSelected, deleteHandler, CreateDialog, EditDialog}) => {
    const classes = useToolbarStyles();
    return (
        <Toolbar
            className={clsx(classes.root, {
                [classes.highlight]: numSelected > 0,
            })}
        >
            <>
                {CreateDialog}
            </>
            {numSelected > 0 ? (
                <Typography
                    className={classes.title}
                    color="inherit"
                    variant="subtitle1"
                >
                    {numSelected} selected
                </Typography>

            ) : (
                <Typography className={classes.title} variant="h5" id="tableTitle">
                    {title}
                </Typography>
            )}

            {numSelected === 1 ? (
                <>
                    {EditDialog}
                </>
            ) : (
                <>
                </>
            )}

            {numSelected > 0 ? (
                <Tooltip title="Delete">
                    <IconButton aria-label="delete" onClick={deleteHandler}>
                        <DeleteIcon/>
                    </IconButton>
                </Tooltip>
            ) : (
                <>
                </>
            )}
        </Toolbar>
    )
};

TableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired
};

export default TableToolbar;
