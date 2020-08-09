import React, {useEffect, useState} from 'react';
import PropTypes from "prop-types";

import {
    Grid,
    Chip,
    Button,
    Paper,
    TextField,
    Typography
} from "@material-ui/core";
import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        listStyle: 'none',
        padding: theme.spacing(0.5),
        margin: 0,
    },
    chip: {
        margin: theme.spacing(0.5),
    }
}));


const ByeInput = ({chipByeData, handleByesAdd, handleByesDelete}) => {

    // useEffect(() => {
    //     console.log(chipByeData);
    // }, [chipByeData]);

    const classes = useStyles();

    const [round, setRound] = useState(0);
    const [byePoint, setByePoint] = useState(0);

    const handleRoundChange = ({target: {value}}) => {
        setRound(value);
    };

    const handleByePointChange = ({target: {value}}) => {
        setByePoint(value);
    };

    return (
        <Grid container spacing={1} alignItems={"center"}>
            <Grid item xs={2}>
                <Typography>Bye:</Typography>
            </Grid>
            <Grid item xs={5}>
                <TextField
                    autoFocus
                    fullWidth
                    variant={"outlined"}
                    margin="dense"
                    label="Round"
                    type="number"
                    value={round}
                    onChange={handleRoundChange}
                    InputProps={{
                        inputProps: {
                            min: 0
                        }
                    }}
                />
            </Grid>
            <Grid item xs={3}>
                <TextField
                    select
                    variant={"outlined"}
                    label={"Point"}
                    value={byePoint}
                    onChange={handleByePointChange}
                    SelectProps={{
                        native: true,
                    }}
                    size={"small"}
                >
                    <option key={1} value={0}>0</option>
                    <option key={2} value={.5}>1/2</option>
                    <option key={3} value={1}>1</option>
                </TextField>
            </Grid>
            <Grid item xs={2}>
                <Button
                    onClick={handleByesAdd(round, byePoint)}
                    disabled={round === 0}
                >
                    Add
                </Button>
            </Grid>
            <Paper component="ul" className={classes.root}>
                {chipByeData.map((bye, index) => {
                    return (
                        <li key={index}>
                            <Chip
                                label={bye.byePoint.toString().concat(" / Round ", bye.roundNumber)}
                                onDelete={handleByesDelete(bye)}
                                className={classes.chip}
                            />
                        </li>
                    );
                })}
            </Paper>
        </Grid>
    );
};

ByeInput.propTypes = {
    chipByeData: PropTypes.array,
    handleByesAdd: PropTypes.func.isRequired,
    handleByesDelete: PropTypes.func.isRequired
};

export default ByeInput;
