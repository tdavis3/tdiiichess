import React, {useState} from "react";
import PropTypes from "prop-types";

import {
    Grid,
    IconButton,
    Tooltip,
    Typography
} from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";
import AssignmentIcon from "@material-ui/icons/Assignment";

import {dateRenderer, tournament_status} from "../../../utils/helpers";

import copy from "copy-to-clipboard";


const useStyles = makeStyles(theme => ({
    center: {
        textAlign: 'center',
        fontSize: 18
    },
    box: {
        padding: theme.spacing(1)
    }
}));


const TournamentInfo = ({tournament}) => {

    const classes = useStyles();

    const initialCopyClipboardToolTipText = "Copy to clipboard";

    const [copyClipboardText, setCopyClipboardText] = useState(initialCopyClipboardToolTipText);

    const handleCopyClipboardToolTipClose = () => {
        setCopyClipboardText(initialCopyClipboardToolTipText);
    };

    const handleCopyToClipboard = () => {
        copy(tournament._id);
        setCopyClipboardText("Copied!");
    };

    return (
        <div className={classes.box}>
            <Typography className={classes.center}>Tournament</Typography>
            <Typography>Name: {tournament.name}</Typography>
            {dateRenderer(tournament.start_date, tournament.end_date)}
            <Typography>Status: {tournament_status(tournament.start_date, tournament.end_date)}</Typography>
            {/* TODO: Alot of style hacking here - probably should change */}
            <Grid container spacing={1} style={{maxHeight: 30}}>
                <Grid item xs={10}>
                    <Typography noWrap>ID: {tournament._id}</Typography>
                </Grid>
                <Grid item xs={2}>
                    <Tooltip title={copyClipboardText} onClose={handleCopyClipboardToolTipClose}>
                        <IconButton aria-label="copy" edge={"start"} style={{bottom: 11}}
                                    onClick={handleCopyToClipboard}>
                            <AssignmentIcon fontSize={"small"}/>
                        </IconButton>
                    </Tooltip>
                </Grid>
            </Grid>
        </div>
    );
};

TournamentInfo.propTypes = {
    tournament: PropTypes.object.isRequired
};

export default TournamentInfo;
