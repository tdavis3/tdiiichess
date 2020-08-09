import React, {useEffect, useState} from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";

import {
    Grid,
    LinearProgress,
    List,
    ListItem,
    ListItemText,
    Typography
} from "@material-ui/core";

import AddSectionDialog from "../../forms/section/AddSectionDialog";
import SectionContextMenu from "../../forms/section/SectionContextMenu";

import {getSections} from "../../../actions/sections";


const SectionsList = ({
                          tournament,
                          sections,
                          sectionDisplayedIndex,
                          setSectionDisplayedIndex,
                          getSections
                      }) => {

    useEffect(() => {
        getSections(tournament.SK);
    }, []);

    const [anchorEl, setAnchorEl] = useState(null);
    const [rightClickedSectionIndex, setRightClickedSectionIndex] = useState(0);
    let rightClickedSection = (sections.loading || sections.sections.length === 0) ? {} : sections.sections[rightClickedSectionIndex];

    const handleSectionClick = (index) => () => {
        setSectionDisplayedIndex(index);
    };

    const handleSectionRightClickToggle = (index) => (e) => {
        e.preventDefault();
        setAnchorEl(e.currentTarget);
        setRightClickedSectionIndex(index);
    };

    const SectionContextMenuProps = {
        rightClickedSectionIndex,
        anchorEl,
        setAnchorEl,
        setSectionDisplayedIndex,
        rightClickedSection
    };

    const open = Boolean(anchorEl);

    return (
        <div>
            <Grid container justify={'center'}>
                <Grid item xs={3} style={{display: 'flex', alignItems: 'center'}}>
                    <Typography style={{fontSize: 18}}>Sections</Typography>
                </Grid>
                <Grid item xs={2}>
                    <AddSectionDialog
                        tournamentId={tournament.SK}
                        tournamentTimeControl={tournament.timeControl}
                    />
                </Grid>
            </Grid>
            {sections.loading && <LinearProgress/>}
            <List component="nav" aria-label="sections">
                {sections.sections.map((section, index) => (
                    <ListItem button selected={sectionDisplayedIndex === index} data-index={index} key={index}
                              onClick={handleSectionClick(index)}
                              onContextMenu={handleSectionRightClickToggle(index)}>
                        <ListItemText primary={section.name}/>
                    </ListItem>
                ))}
            </List>
            {open && <SectionContextMenu display={open} {...SectionContextMenuProps}/>}
        </div>
    );
};

SectionsList.propTypes = {
    sectionDisplayedIndex: PropTypes.number.isRequired,
    setSectionDisplayedIndex: PropTypes.func.isRequired,
    tournament: PropTypes.object.isRequired,
    sections: PropTypes.object.isRequired,
    getSections: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    sections: state.sections
});

export default connect(mapStateToProps, {getSections})(SectionsList);
