import React from 'react';

import {
    // Paper,
    Button,
    Typography,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TableSortLabel,
    Toolbar,
    InputBase,
} from "@material-ui/core";

import SearchIcon from '@material-ui/icons/Search';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import {fade, makeStyles} from '@material-ui/core/styles';
import MaUTable from '@material-ui/core/Table';
import {useRowSelect, useSortBy, useTable} from 'react-table';

import PropTypes from 'prop-types';
import IconButton from "@material-ui/core/IconButton";
import AddPlayerDialog from "../forms/AddPlayerDialog";
import {Link} from "react-router-dom";
import CssBaseline from "@material-ui/core/CssBaseline";
import {useBlockLayout} from "react-table/src/plugin-hooks/useBlockLayout";


const useStyles = makeStyles((theme) => ({
    root: {
        // flexGrow: 1
    },
    leftSection: {
        flexGrow: 1,
        display: 'none',
        [theme.breakpoints.up('sm')]: {
            display: 'block',
        },
    },
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: fade(theme.palette.common.white, 0.25),
        },
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(1),
            width: 'auto',
        },
    },
    searchIcon: {
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputRoot: {
        color: 'inherit',
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: '12ch',
            '&:focus': {
                width: '20ch',
            },
        },
    },
}));

const DashboardTable = ({
                            columns,
                            data,
                            parent_id,
                            disabled_add_button
                        }) => {
    const {
        getTableProps,
        headerGroups,
        rows,
        prepareRow,
        state: {selectedRowIds},
    } = useTable(
        {
            columns,
            data,
        },
        useSortBy,
        useRowSelect,
        // useBlockLayout,
        // useFlexLayout,
        // useAbsoluteLayout
    );

    const classes = useStyles();

    // Render the UI for your table
    return (
        // <Paper>
        <div>
            <CssBaseline/>
            <Toolbar>  {/*TODO Clean this toolbar up*/}
                <IconButton component={Link} to={'/tournaments'}>
                    <NavigateBeforeIcon fontSize={"large"}/>
                </IconButton>
                <Typography variant={'h6'}>Players</Typography>
                <AddPlayerDialog parent_id={parent_id} disabled={disabled_add_button}/>
                <Button size={"small"}>Withdrawals</Button>
                <Button size={"small"}>Byes</Button>
                <Button size={"small"}>Move</Button>
                <Typography className={classes.leftSection}></Typography>
                <Button size={"small"}>Pairings</Button>
                <Button size={"small"}>Standings</Button>
                <Button size={"small"}>Reports</Button>
                <div className={classes.search}>
                    <div className={classes.searchIcon}>
                        <SearchIcon/>
                    </div>
                    <InputBase
                        placeholder="Search…"
                        classes={{
                            root: classes.inputRoot,
                            input: classes.inputInput,
                        }}
                        inputProps={{'aria-label': 'search'}}
                    />
                </div>
                <IconButton>
                    <MoreVertIcon/>
                </IconButton>
            </Toolbar>

            <MaUTable {...getTableProps()}>
                <TableHead>
                    {headerGroups.map(headerGroup => (
                        <TableRow {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                <TableCell
                                    {...(column.id === 'selection'
                                        ? column.getHeaderProps()
                                        : column.getHeaderProps(column.getSortByToggleProps()))}
                                >
                                    {column.render('Header')}
                                    {column.id !== 'selection' ? (
                                        <TableSortLabel
                                            active={column.isSorted}
                                            // react-table has a unsorted state which is not treated here
                                            direction={column.isSortedDesc ? 'desc' : 'asc'}
                                        />
                                    ) : null}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableHead>
                <TableBody>
                    {rows.map((row, i) => {
                        prepareRow(row);
                        return (
                            <TableRow hover {...row.getRowProps()}>
                                {row.cells.map(cell => {
                                    return (
                                        <TableCell {...cell.getCellProps()}>
                                            {cell.render('Cell')}
                                        </TableCell>
                                    )
                                })}
                            </TableRow>
                        )
                    })}
                </TableBody>
            </MaUTable>
        </div>
        // </Paper>
    )
};

DashboardTable.propTypes = {
    disabled_add_button: PropTypes.bool,
    columns: PropTypes.array.isRequired,
    data: PropTypes.array.isRequired
};

export default DashboardTable;
