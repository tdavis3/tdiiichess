import React, {useState} from 'react';

import {
    Popover,
    MenuList,
    MenuItem,
} from "@material-ui/core";
import EditSectionDialog from "./EditSectionDialog";

import PropTypes from 'prop-types';
import {connect} from "react-redux";
import {duplicateSection, deleteSection} from "../../../actions/sections";


const SectionContextMenu = ({
                                display,
                                anchorEl,
                                setAnchorEl,
                                rightClickedSectionIndex,
                                setSectionDisplayedIndex,
                                rightClickedSection,
                                duplicateSection,
                                deleteSection
                            }) => {

    const [openEditSectionDialog, setOpenEditSectionDialog] = useState(false);

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    const handleClose = (event) => {
        setAnchorEl(null);  // Close the contextMenu
    };

    const handleEdit = () => {
        setOpenEditSectionDialog(true);
    };

    const handleDuplicate = () => {
        duplicateSection(rightClickedSection._id);
        setAnchorEl(null);
    };

    const handleMove = () => {
        setAnchorEl(null);
    };

    const handleDelete = () => {
        deleteSection(rightClickedSection._id);
        setSectionDisplayedIndex(prevState => {
            if ((rightClickedSectionIndex !== 0 || prevState !== 0) && prevState !== 0) {
                return prevState - 1;
            } else {
                return prevState;
            }
        });
        setAnchorEl(null);
    };

    return (
        <div>
            <Popover
                id={id}
                open={display}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
            >
                <MenuList autoFocusItem={display}>
                    <MenuItem onClick={handleEdit}>Edit</MenuItem>
                    <MenuItem onClick={handleDuplicate}>Duplicate</MenuItem>
                    <MenuItem onClick={handleMove}>Move</MenuItem>
                    <MenuItem onClick={handleDelete}>Delete</MenuItem>
                </MenuList>
            </Popover>
            <EditSectionDialog display={openEditSectionDialog}
                               setAnchorEl={setAnchorEl}
                               setDisplay={setOpenEditSectionDialog}
                               selectedSection={rightClickedSection}/>
        </div>
    )
};

SectionContextMenu.propTypes = {
    rightClickedSectionIndex: PropTypes.number.isRequired,
    rightClickedSection: PropTypes.object.isRequired,
    display: PropTypes.bool.isRequired,
    setSectionDisplayedIndex: PropTypes.func.isRequired,
    duplicateSection: PropTypes.func.isRequired,
    deleteSection: PropTypes.func.isRequired,
};

export default connect(null, {duplicateSection, deleteSection})(SectionContextMenu);
