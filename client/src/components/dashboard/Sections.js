import React, {useEffect} from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {getCurrentSections, deleteSection} from "../../actions/sections";
import {Link} from "react-router-dom";
import CssBaseline from "@material-ui/core/CssBaseline";
import EnhancedTable from "../layout/EnhancedTable";
import AddSectionDialog from "../tournament-forms/AddSectionDialog";
import EditSectionDialog from "../tournament-forms/EditSectionDialog";

const Sections = props => {
    useEffect(() => {
        props.getCurrentSections(props.location.state.tourney._id);
    }, []);

    const columns = React.useMemo(
        () => [
            {
                Header: 'Name',
                accessor: 'name',
                Cell: ({cell}) => {
                    const value = cell.value;
                    const section = cell.row.original;
                    console.log(value);
                    console.log(section);
                    return (
                        <Link to={{pathname: "/tournaments/sections/dashboard", state: {section}}}>
                            {value}
                        </Link>
                    );
                }
            },
            {
                Header: 'Event Type',
                accessor: 'eventtype',
            },
            {
                Header: 'Time Control',
                accessor: 'timecontrol',
            },
            {
                Header: 'Players',
                accessor: 'players',
                Cell: ({cell: {value}}) => {
                    return (
                        <>{value.length}</>
                    );
                }
            },
        ],
        []
    );

    const data = React.useMemo(() => props.sections.sections, [props.sections.sections]);

    return (
        <div>
            <CssBaseline/>
            <h3>Tournament: {props.location.state.tourney.name}</h3>
            <EnhancedTable
                title={'Sections'}
                parent_id={props.location.state.tourney._id}
                columns={columns}
                data={data}
                deleteaction={props.deleteSection}
                CreateDialog={AddSectionDialog}
                EditDialog={EditSectionDialog}
            />
        </div>
    );
};

Sections.propTypes = {
    getCurrentSections: PropTypes.func.isRequired,
    deleteSection: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    sections: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
    sections: state.sections
});

export default connect(mapStateToProps, {
    getCurrentSections,
    deleteSection,
})(Sections);
