import React, {useEffect, useState} from 'react';
import {useHistory} from "react-router-dom";

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
    IconButton,
    LinearProgress, Tooltip
} from "@material-ui/core";
import {fade, makeStyles} from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import MaUTable from '@material-ui/core/Table';
import {
    useRowSelect,
    useSortBy,
    useTable,
    useFlexLayout,
    useResizeColumns,
    useFilters,
    useGlobalFilter,
    useAsyncDebounce
} from 'react-table';
import RefreshIcon from "@material-ui/icons/Refresh";

import ByesDialog from "../forms/section/ByesDialog";
import SectionTableOptions from "./SectionTableOptions";
import PairingsDropdown from "../pairings/PairingsDropdown";
import MovePlayerDialog from "../forms/player/MovePlayerDialog";
import WithdrawalsDialog from "../forms/section/WithdrawalsDialog";
import AddPlayerDialog from "../forms/player/AddPlayer/AddPlayerDialog";

import PropTypes from 'prop-types';
import {connect} from "react-redux";
import {clearSections} from "../../actions/sections";
import {getPlayers, stopPlayersLoading, clearPlayers} from "../../actions/players";


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
                            selectedSectionIndex,
                            sectionId,
                            players,
                            sections,
                            tournament,
                            getPlayers,
                            clearPlayers,
                            clearSections,
                            stopPlayersLoading
                        }) => {

    let history = useHistory();

    useEffect(() => {
        if (players.players[sectionId] === undefined) {  // Players not loaded yet
            if (!sectionId) {  // If sections are not loaded yet just wait
                stopPlayersLoading();
                return;
            }
            getPlayers(tournament.SK, sectionId);
        } else if (sections.sections === [] && sections.loading === false) {  // No sections
            stopPlayersLoading();
        } else {
            // Players were already loaded for this section
            setData(players.players[sectionId]);
        }
    }, [players.players, sectionId]);
    // TODO: I believe this re-renders one too many times and is sloppy - although it works

    const [data, setData] = useState([]);

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
            data
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
        clearPlayers();
        history.goBack();
    };

    const handleRefresh = () => {
        getPlayers(tournament.SK, sectionId);
    };

    return (
        // <Paper>
        <div>
            <CssBaseline/>
            <Toolbar>
                <IconButton onClick={handleBackButtonClick}>
                    <NavigateBeforeIcon fontSize={"large"}/>
                </IconButton>
                <Typography variant={'h6'}>Players</Typography>
                <AddPlayerDialog tournament={tournament} sectionId={sectionId}/>
                {/*<WithdrawalsDialog selectedSectionId={sectionId} selectedSectionIndex={selectedSectionIndex}/>*/}
                {/*<ByesDialog selectedSectionId={sectionId} selectedSectionIndex={selectedSectionIndex}/>*/}
                {/*<MovePlayerDialog selectedSectionId={sectionId} selectedRowIds={selectedRowIds}/>*/}
                <Typography className={classes.leftSection}></Typography>
                <PairingsDropdown
                    selectedSectionIndex={selectedSectionIndex}
                    currentSectionId={sectionId}
                />
                <Button size={"small"}>Standings</Button>
                <Button size={"small"}>Reports</Button>
                <Tooltip title="Refresh">
                    <IconButton aria-label="refresh" onClick={handleRefresh}>
                        <RefreshIcon/>
                    </IconButton>
                </Tooltip>
                <GlobalFilter
                    preGlobalFilteredRows={preGlobalFilteredRows}
                    globalFilter={globalFilter}
                    setGlobalFilter={setGlobalFilter}
                />
                <SectionTableOptions/>
            </Toolbar>
            {/* TODO: On load - both of these progresses are loading making it double thick */}
            {players.loading && <LinearProgress/>}
            {(sections.loading && players.loading) ? <LinearProgress/> :
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
            }
        </div>
        // </Paper>
    )
};

DashboardTable.propTypes = {
    columns: PropTypes.array.isRequired,
    sections: PropTypes.object.isRequired,
    players: PropTypes.object.isRequired,
    selectedSectionIndex: PropTypes.number.isRequired,
    sectionId: PropTypes.string.isRequired,
    tournament: PropTypes.object.isRequired,
    getPlayers: PropTypes.func.isRequired,
    clearSections: PropTypes.func.isRequired,
    clearPlayers: PropTypes.func.isRequired,
    stopPlayersLoading: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    players: state.players,
    sections: state.sections
});

export default connect(mapStateToProps, {getPlayers, clearSections, clearPlayers, stopPlayersLoading,})(DashboardTable);
