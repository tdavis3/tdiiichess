import React from 'react';

import {
    // Paper,
    Checkbox,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TableSortLabel
} from "@material-ui/core";
import {makeStyles} from '@material-ui/core/styles';
import MaUTable from '@material-ui/core/Table';
import {useRowSelect, useSortBy, useTable} from 'react-table';

import TableToolbar from "./TableToolbar";

import PropTypes from 'prop-types';


const IndeterminateCheckbox = React.forwardRef(
    ({indeterminate, ...rest}, ref) => {
        const defaultRef = React.useRef();
        const resolvedRef = ref || defaultRef;

        React.useEffect(() => {
            resolvedRef.current.indeterminate = indeterminate
        }, [resolvedRef, indeterminate]);

        return (
            <>
                <Checkbox ref={resolvedRef} {...rest} />
            </>
        )
    }
);

const useStyles = makeStyles({
    root: {
        display: 'block',
        maxWidth: '100%'
    },
    table: {
        width: '100%',
        borderSpacing: 0
    },
    tr: {}
});

const EnhancedTable = ({
                           title,
                           columns,
                           data,
                           deleteaction,
                           CreateDialog,
                           EditDialog,
                           parent_id
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
        hooks => {
            hooks.allColumns.push(columns => [
                // Let's make a column for selection
                {
                    id: 'selection',
                    // The header can use the table's getToggleAllRowsSelectedProps method
                    // to render a checkbox.  Pagination is a problem since this will select all
                    // rows even though not all rows are on the current page.  The solution should
                    // be server side pagination.  For one, the clients should not download all
                    // rows in most cases.  The client should only download data for the current page.
                    // In that case, getToggleAllRowsSelectedProps works fine.
                    Header: ({getToggleAllRowsSelectedProps}) => (
                        <div>
                            <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
                        </div>
                    ),
                    // The cell can use the individual row's getToggleRowSelectedProps method
                    // to the render a checkbox
                    Cell: ({row}) => (
                        <div>
                            <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
                        </div>
                    ),
                },
                ...columns,
            ])
        }
    );

    const classes = useStyles();

    const removeByIndexs = (array, indexs) =>
        array.filter((_, i) => indexs.includes(i));

    const getselectededitData = () => {
        if (Object.keys(selectedRowIds).length === 1) {
            const obj_toedit = removeByIndexs(
                data,
                Object.keys(selectedRowIds).map(x => parseInt(x, 10))
            );
            return obj_toedit[0];
        }
    };

    const deleteHandler = event => {
        const objs = removeByIndexs(
            data,
            Object.keys(selectedRowIds).map(x => parseInt(x, 10))
        );
        const info = {
            objs: objs,
            parent_id: parent_id  // Will only be used by the deleteaction if necessary
        };
        deleteaction(info);
    };

    // Render the UI for your table
    return (
        // <Paper>
        <TableContainer>
            <TableToolbar
                title={title}
                numSelected={Object.keys(selectedRowIds).length}
                deleteHandler={deleteHandler}
                CreateDialog={<CreateDialog parent_id={parent_id}/>}
                EditDialog={<EditDialog selected_edit={getselectededitData()}/>}
            />

            <MaUTable stickyHeader aria-label="enhanced table" {...getTableProps()}>
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
        </TableContainer>
        // </Paper>
    )
};

EnhancedTable.propTypes = {
    columns: PropTypes.array.isRequired,
    data: PropTypes.array.isRequired,
    deleteaction: PropTypes.func.isRequired
};

export default EnhancedTable;
