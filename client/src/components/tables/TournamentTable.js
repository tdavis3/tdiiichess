import React, {useState, useMemo} from 'react';

import {
    // Paper,
    Typography,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TableSortLabel,
    Toolbar,
    InputBase,
    LinearProgress
} from "@material-ui/core";
import SearchIcon from '@material-ui/icons/Search';
import CssBaseline from "@material-ui/core/CssBaseline";
import TournamentTableOptions from "./TournamentTableOptions";
import {fade, makeStyles} from '@material-ui/core/styles';
import MaUTable from '@material-ui/core/Table';
import {useRowSelect, useSortBy, useTable, useFilters, useGlobalFilter, useAsyncDebounce} from 'react-table';

import PropTypes from 'prop-types';
import AddTournamentDialog from "../forms/tournament/AddTournamentDialog";
import {connect} from "react-redux";


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
        backgroundColor: fade(theme.palette.common.black, 0.15),
        '&:hover': {
            backgroundColor: fade(theme.palette.common.black, 0.25),
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

// Define a default UI for filtering
function GlobalFilter({
                          preGlobalFilteredRows,
                          globalFilter,
                          setGlobalFilter,
                      }) {
    const classes = useStyles();
    const count = preGlobalFilteredRows.length
    const [value, setValue] = useState(globalFilter)
    const onChange = useAsyncDebounce(value => {
        setGlobalFilter(value || undefined)
    }, 200)

    return (
        <div className={classes.search}>
            <div className={classes.searchIcon}>
                <SearchIcon/>
            </div>
            <InputBase
                value={value || ""}
                onChange={e => {
                    setValue(e.target.value);
                    onChange(e.target.value);
                }}
                // placeholder={`${count} tournaments...`}
                placeholder={"Search..."}
                classes={{
                    root: classes.inputRoot,
                    input: classes.inputInput
                }}
                inputProps={{'aria-label': 'search'}}
            />
        </div>
    )
}

// Define a default UI for filtering
function DefaultColumnFilter({
                                 column: {filterValue, preFilteredRows, setFilter},
                             }) {
    const count = preFilteredRows.length

    return (
        <input
            value={filterValue || ''}
            onChange={e => {
                setFilter(e.target.value || undefined) // Set undefined to remove the filter entirely
            }}
            placeholder={`Search ${count} records...`}
        />
    )
}


const TournamentTable = ({
                             columns,
                             data,
                             tournaments
                         }) => {

    const defaultColumn = useMemo(
        () => ({
            // Let's set up our default Filter UI
            Filter: DefaultColumnFilter,
        }),
        []
    )

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        visibleColumns,
        preGlobalFilteredRows,
        setGlobalFilter,
        state: {globalFilter},
    } = useTable(
        {
            columns,
            data,
            defaultColumn
        },
        useFilters,
        useGlobalFilter,
        useSortBy,
        useRowSelect
    );

    const classes = useStyles();

    return (
        <div>
            <CssBaseline/>
            <Toolbar>  {/*TODO Clean this toolbar up*/}
                <Typography style={{fontSize: 20}}>Tournaments</Typography>
                {/* Understand why exactly this dialog does not need a userId reference?? */}
                <AddTournamentDialog/>
                <Typography className={classes.leftSection}></Typography>
                <GlobalFilter
                    preGlobalFilteredRows={preGlobalFilteredRows}
                    globalFilter={globalFilter}
                    setGlobalFilter={setGlobalFilter}
                />
                <TournamentTableOptions/>
            </Toolbar>
            {tournaments.loading && <LinearProgress/>}
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
                <TableBody {...getTableBodyProps()}>
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
    );
};

TournamentTable.propTypes = {
    columns: PropTypes.array.isRequired,
    data: PropTypes.array.isRequired,
    tournaments: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    tournaments: state.tournaments
});

export default connect(mapStateToProps)(TournamentTable);
