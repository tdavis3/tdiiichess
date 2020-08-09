import React, {useState} from 'react';
import {Button, Grid, LinearProgress, List, ListItem, TextField} from "@material-ui/core";

import PropTypes from 'prop-types';
import {scrapePlayerInfo} from "../../../../actions/players";
import {connect} from "react-redux";
import Typography from "@material-ui/core/Typography";

const AddPlayerSearch = ({scraper, scrapePlayerInfo}) => {

    const [player, setPlayer] = useState({
        firstName: "",
        lastName: "",
        state: "",
        uscfId: ""
    });

    const handleChange = e => {
        setPlayer({...player, [e.target.id]: e.target.value});
    };

    const handleSearch = () => {
        if (player.uscfId) {
            scrapePlayerInfo({...player, searchType: "uscfId"});
        } else {
            scrapePlayerInfo({...player, searchType: "details"});
        }
    };

    const handlePlayerTransfer = (index) => () => {
        console.log(scraper.players[index]);
        // TODO: Transfer the player to the registration tab
    };

    return (
        <div>
            {scraper.loading && <LinearProgress/>}
            <Grid container spacing={3}>
                <Grid item xs={6}>
                    <TextField
                        autoFocus
                        variant={"outlined"}
                        margin="dense"
                        label="First Name"
                        type="text"
                        fullWidth
                        id="firstName"
                        value={player.firstName}
                        onChange={handleChange}
                        size={"small"}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        autoFocus
                        variant={"outlined"}
                        margin="dense"
                        label="Last Name"
                        type="text"
                        fullWidth
                        id="lastName"
                        value={player.lastName}
                        onChange={handleChange}
                        size={"small"}
                    />
                </Grid>
            </Grid>
            <Grid container spacing={3}>
                <Grid item xs={6}>
                    <TextField
                        autoFocus
                        variant={"outlined"}
                        margin="dense"
                        label="State"
                        type="text"
                        fullWidth
                        id="state"
                        value={player.state}
                        onChange={handleChange}
                        size={"small"}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        autoFocus
                        variant={"outlined"}
                        margin="dense"
                        label="USCF ID"
                        type="text"
                        fullWidth
                        id="uscfId"
                        value={player.uscfId}
                        onChange={handleChange}
                        size={"small"}
                    />
                </Grid>
            </Grid>
            <Button onClick={handleSearch}
                    color="primary">
                Search
            </Button>
            <List component="nav" aria-label="scraped players USCF">
                {scraper.players.map((player, index) => (
                    <ListItem button data-index={index} key={index} onDoubleClick={handlePlayerTransfer(index)}>
                        <Grid container spacing={3}>
                            <Grid item xs={3}>
                                <Typography>{player.fullName}</Typography>
                            </Grid>
                            <Grid item xs={3}>
                                <Typography>{player.state}</Typography>
                            </Grid>
                            <Grid item xs={3}>
                                <Typography>{player.regularRating}</Typography>
                            </Grid>
                            <Grid item xs={3}>
                                <Typography>{player.expirationDate}</Typography>
                            </Grid>
                        </Grid>
                    </ListItem>
                ))}
            </List>
        </div>
    );
};

AddPlayerSearch.propTypes = {
    scraper: PropTypes.object.isRequired,
    scrapePlayerInfo: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    scraper: state.players.scraper
});

export default connect(mapStateToProps, {scrapePlayerInfo})(AddPlayerSearch);
