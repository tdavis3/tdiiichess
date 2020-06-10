import React, {useEffect, useState} from 'react';
import {Link} from "react-router-dom";

import {
    // Paper,
    CssBaseline,
    Button,
    Typography,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TableSortLabel,
    Toolbar,
    InputBase,
    Checkbox,
    IconButton
} from "@material-ui/core";
import SearchIcon from '@material-ui/icons/Search';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import {fade, makeStyles} from '@material-ui/core/styles';
import MaUTable from '@material-ui/core/Table';
import {
    useRowSelect,
    useSortBy,
    useTable,
    useFlexLayout,
    useResizeColumns,
    useFilters,
    useGlobalFilter, useAsyncDebounce
} from 'react-table';

import AddPlayerDialog from "../forms/player/AddPlayerDialog";
import MovePlayerDialog from "../forms/player/MovePlayerDialog";

import PropTypes from 'prop-types';
import {connect} from "react-redux";
import {clearSections} from "../../actions/sections";
import SectionTableOptions from "./SectionTableOptions";


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

const IndeterminateCheckbox = React.forwardRef(
    ({indeterminate, ...rest}, ref) => {
        const defaultRef = React.useRef();
        const resolvedRef = ref || defaultRef;

        useEffect(() => {
            resolvedRef.current.indeterminate = indeterminate
        }, [resolvedRef, indeterminate]);

        return (
            <>
                <Checkbox size="small" ref={resolvedRef} {...rest} />
            </>
        )
    }
);

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

const DashboardTable = ({
                            columns,
                            data,
                            sections,
                            sectionId,
                            clearSections
                        }) => {

    const {
        getTableProps,
        headerGroups,
        rows,
        prepareRow,
        state: {selectedRowIds, globalFilter},
        preGlobalFilteredRows,
        setGlobalFilter,
    } = useTable(
        {
            columns,
            data,
        },
        useFilters,
        useGlobalFilter,
        useSortBy,
        useRowSelect,
        hooks => {
            hooks.allColumns.push(columns => [
                // A column for selection
                {
                    id: 'selection',
                    width: 10,
                    maxWidth: 20,
                    Header: ({getToggleAllRowsSelectedProps}) => (
                        <div>
                            <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
                        </div>
                    ),
                    Cell: ({row}) => (
                        <div>
                            <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
                        </div>
                    ),
                },
                ...columns,
            ])
        },
        useResizeColumns,
        useFlexLayout,
    );

    const classes = useStyles();

    const handleBackButtonClick = () => {
        clearSections();
    };

    // Render the UI for your table
    return (
        // <Paper>
        <div>
            <CssBaseline/>
            <Toolbar>  {/*TODO Clean this toolbar up*/}
                <IconButton component={Link} to={'/tournaments'} onClick={handleBackButtonClick}>
                    <NavigateBeforeIcon fontSize={"large"}/>
                </IconButton>
                <Typography variant={'h6'}>Players</Typography>
                <AddPlayerDialog sectionId={sectionId}/>
                <Button size={"small"}>Withdrawals</Button>
                <Button size={"small"}>Byes</Button>
                <MovePlayerDialog oldSectionId={sectionId} selectedRowIds={selectedRowIds} players={data}
                                  sections={sections}/>
                <Typography className={classes.leftSection}></Typography>
                <Button size={"small"}>Pairings</Button>
                <Button size={"small"}>Standings</Button>
                <Button size={"small"}>Reports</Button>
                <GlobalFilter
                    preGlobalFilteredRows={preGlobalFilteredRows}
                    globalFilter={globalFilter}
                    setGlobalFilter={setGlobalFilter}
                />
                <SectionTableOptions/>
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
    columns: PropTypes.array.isRequired,
    data: PropTypes.array.isRequired,
    sections: PropTypes.object.isRequired,
    sectionId: PropTypes.string.isRequired,
    clearSections: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    sections: state.sections
});

export default connect(mapStateToProps, {clearSections})(DashboardTable);
