const express = require("express");
const mongoose = require('mongoose');
const router = express.Router();
const auth = require("../../middleware/auth");
const Player = require("../../models/Player");
const Section = require("../../models/Section");
const {check, validationResult} = require("express-validator");
const getuscfhtml = require("../../scrape");
const config = require("config");
const partialuscfURI = config.get("uscfURI");

// @route   GET api/players
// @desc    Get one specific player
// @access  Private (A token is needed)
router.get("/player/:playerId", auth, async (req, res) => {
    try {
        const player = await Player.findById(req.params.playerId);
        if (player) {
            return res.json(player);
        }
        await res.status(404).json({msg: "No player found"});
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// @route   GET api/players/{sectionId}
// @desc    Get all players from a section
// @access  Private (A token is needed)
router.get("/:sectionId", auth, async (req, res) => {
    try {
        const players = await Section.findById(req.params.sectionId)
            .populate("players.player_id")
            .select("players");
        if (players) {
            // Return ARRAY of players in the specified section
            return res.json(players.players);
        }
        await res.status(404).json({msg: "No players in this section"});
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// @route   POST api/players/{sectionId}
// @desc    Add player to a section
// @access  Private (A token is needed)
router.post("/:sectionId", auth, async (req, res) => {
    const {
        first_name,
        last_name,
        suffix,
        uscf_id,
        uscf_reg_rating,
        uscf_blitz_rating,
        uscf_quick_rating,
        state,
        fide_id,
        fide_rating,
        expired,
        email,
        cell,
        dob
    } = req.body;

    const playerFields = {};

    // Weird but ok
    await getuscfhtml(partialuscfURI, uscf_id).then(async playerobject => {
        if (playerobject === null) {
            if (first_name) playerFields.first_name = first_name;
            if (last_name) playerFields.last_name = last_name;
            if (suffix) playerFields.suffix = suffix;
            if (state) playerFields.state = state;
            if (uscf_reg_rating) playerFields.uscf_reg_rating = uscf_reg_rating;
            if (uscf_blitz_rating) playerFields.uscf_blitz_rating = uscf_blitz_rating;
            if (uscf_quick_rating) playerFields.uscf_quick_rating = uscf_quick_rating;
            if (uscf_id) playerFields.uscf_id = uscf_id;
            if (fide_id) playerFields.fide_id = fide_id;
            if (fide_rating) playerFields.fide_rating = fide_rating;
            if (expired) playerFields.expired = expired;
            if (email) playerFields.email = email;
            if (cell) playerFields.cell = cell;
            if (dob) playerFields.dob = dob;
        } else {
            if (playerobject.firstname)
                playerFields.first_name = playerobject.firstname;
            if (playerobject.lastname) playerFields.last_name = playerobject.lastname;
            if (playerobject.suffix) playerFields.suffix = playerobject.suffix;
            if (playerobject.uscfid) playerFields.uscf_id = playerobject.uscfid;
            if (playerobject.regrating)
                playerFields.uscf_reg_rating = playerobject.regrating;
            if (playerobject.blitzrating)
                playerFields.uscf_blitz_rating = playerobject.blitzrating;
            if (playerobject.quickrating)
                playerFields.uscf_quick_rating = playerobject.quickrating;
            if (playerobject.state) playerFields.state = playerobject.state;
            if (playerobject.expires) playerFields.expires = playerobject.expires;
            if (playerobject.fidecountry)
                playerFields.fide_country = playerobject.fidecountry;
            if (playerobject.fideid) playerFields.fide_id = playerobject.fideid;
            if (email) playerFields.email = email;
            if (cell) playerFields.cell = cell;
            if (dob) playerFields.dob = dob;
        }
        try {
            const player = new Player(playerFields);
            const savedPlayer = await player.save();

            const updatedSection = await Section.findByIdAndUpdate(
                req.params.sectionId,
                {
                    $push: {
                        players: {
                            player_id: savedPlayer._id,
                            total_points: 0,
                            withdrew: false
                        }
                    }
                }, {new: true}
            ).populate("players.player_id");
            if (savedPlayer && updatedSection) {
                return res.json(updatedSection);
            }
            res.status(404).json({errors: "This section does not exist"});
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Server Error");
        }
    });
});

// @route   PUT api/players
// @desc    Edit player in a section
// @access  Private (A token is needed)
router.put("/:playerId", auth, async (req, res) => {
    const {
        first_name,
        last_name,
        suffix,
        uscf_id,
        uscf_reg_rating,
        uscf_blitz_rating,
        uscf_quick_rating,
        state,
        fide_id,
        fide_rating,
        expired,
        email,
        cell,
        dob
    } = req.body;

    const playerFields = {};
    const separatePlayerFields = {};

    if (first_name) playerFields.first_name = first_name;
    if (last_name) playerFields.last_name = last_name;
    if (suffix) playerFields.suffix = suffix;
    if (state) playerFields.state = state;
    if (uscf_reg_rating) playerFields.uscf_reg_rating = uscf_reg_rating;
    if (uscf_blitz_rating) playerFields.uscf_blitz_rating = uscf_blitz_rating;
    if (uscf_quick_rating) playerFields.uscf_quick_rating = uscf_quick_rating;
    if (uscf_id) playerFields.uscf_id = uscf_id;
    if (fide_id) playerFields.fide_id = fide_id;
    if (fide_rating) playerFields.fide_rating = fide_rating;
    if (expired) playerFields.expired = expired;
    if (email) playerFields.email = email;
    if (cell) playerFields.cell = cell;
    if (dob) playerFields.dob = dob;

    try {
        const updatedPlayer = await Player.findByIdAndUpdate(
            req.params.playerId,
            {
                $set: playerFields
            },
            {new: true}
        );
        // Update section specific player fields in another route
        // separatePlayerFields.player_id = updatedPlayer._id;
        //
        // const updatedSectionPlayer = await Section.findByIdAndUpdate(
        //   updatedPlayer.sectionId,
        //   { $set: { "players.$[player]": separatePlayerFields } },
        //   {
        //     new: true,
        //     arrayFilters: [{ "player.player_id": { $eq: req.params.playerId } }]
        //   }
        // );
        if (updatedPlayer) {
            // TODO - Add the separatePlayerFields to the updatedPlayer object
            return res.json(updatedPlayer);
        }
        await res.status(404).send("Could not find player");
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// @route   PUT api/players/{oldSectionId}/{playerId}/{newSectionId}
// @desc    Move a player from one section to another
// @access  Private (A token is needed)
router.put("/move/:oldSectionId/:newSectionId", auth, async (req, res) => {
    const oldSectionId = req.params.oldSectionId;
    const newSectionId = req.params.newSectionId;
    const {movingPlayerObj} = req.body;
    movingPlayerObj.previous_opponents = [];  // Reset previous opponents
    const session = await mongoose.startSession();
    await session.startTransaction();
    try {
        /*
        Use transactions to maintain atomicity
         */
        const updatedOldSection = await Section.findOneAndUpdate(
            {_id: oldSectionId},  // Find section
            {$pull: {players: {player_id: movingPlayerObj.player_id._id}}},
            {new: true, multi: true}
        ).populate("players.player_id").session(session);

        const updatedNewSection = await Section.findOneAndUpdate(
            {_id: newSectionId},  // Find section
            {$push: {players: movingPlayerObj}},
            {new: true, multi: true}
        ).populate("players.player_id").session(session);

        await session.commitTransaction();

        res.json({updatedOldSection, updatedNewSection});
    } catch (err) {
        await session.abortTransaction();
        console.error(err.message);
        res.status(500).send("Server Error");
    } finally {
        await session.endSession();
    }
});

// @route   PUT api/players
// @desc    Delete player from a section
// @access  Private (A token is needed)
router.put("/:sectionId/:playerId", auth, async (req, res) => {
    try {
        const updatedSection = await Section.findByIdAndUpdate(
            req.params.sectionId,
            {
                $pull: {players: {player_id: req.params.playerId}}
            },
            {new: true, multi: true}
        );
        if (updatedSection) {
            return res.send(updatedSection);
        }
        await res.status(400).send("Could not delete player");
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// @route   POST api/players
// @desc    Add a player to Player collection
// @access  Private (A token is needed)
router.post("/", auth, async (req, res) => {
    const {
        first_name,
        last_name,
        uscf_id,
        uscf_reg_rating,
        uscf_blitz_rating,
        uscf_quick_rating,
        state,
        fide_id,
        fide_rating,
        expired,
        email,
        cell,
        dob
    } = req.body;
    const playerFields = {};
    if (uscf_id) {
        const playerobject = await getuscfhtml(partialuscfURI, uscf_id);
    } else {
        const playerobject = null;
    }
    if (playerobject === null) {
        if (first_name) playerFields.first_name = first_name;
        if (last_name) playerFields.last_name = last_name;
        if (state) playerFields.state = state;
        if (uscf_reg_rating) playerFields.uscf_reg_rating = uscf_reg_rating;
        if (uscf_blitz_rating) playerFields.uscf_blitz_rating = uscf_blitz_rating;
        if (uscf_quick_rating) playerFields.uscf_quick_rating = uscf_quick_rating;
        if (uscf_id) playerFields.uscf_id = uscf_id;
        if (fide_id) playerFields.fide_id = fide_id;
        if (fide_rating) playerFields.fide_rating = fide_rating;
        if (expired) playerFields.expired = expired;
        if (email) playerFields.email = email;
        if (cell) playerFields.cell = cell;
        if (dob) playerFields.dob = dob;
    } else {
        if (playerobject.firstname) playerFields.first_name = playerobject.firstname;
        if (playerobject.lastname) playerFields.last_name = playerobject.lastname;
        if (playerobject.regrating)
            playerFields.uscf_reg_rating = playerobject.regrating;
        if (playerobject.blitzrating)
            playerFields.uscf_blitz_rating = playerobject.blitzrating;
        if (playerobject.quickrating)
            playerFields.uscf_quick_rating = playerobject.quickrating;
        if (playerobject.state) playerFields.state = playerobject.state;
        if (playerobject.expires) playerFields.expires = playerobject.expires;
        if (playerobject.fidecountry)
            playerFields.fide_country = playerobject.fidecountry;
        if (playerobject.fideid) playerFields.fide_id = playerobject.fideid;
        if (email) playerFields.email = email;
        if (cell) playerFields.cell = cell;
        if (dob) playerFields.dob = dob;
    }

    try {
        const player = new Player(playerFields);
        const savedplayer = await player.save();

        if (savedplayer) {
            return res.json(savedplayer);
        }
        res.status(400).json({errors: "Cannot add player"});
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// @route   DELETE api/players
// @desc    Delete a player from Player collection
// @access  Private (A token is needed)
router.delete("/:playerId", auth, async (req, res) => {
    const {uscf_id} = req.body;

    try {
        const deletedPlayer = await Player.findByIdAndDelete(req.params.playerId);

        if (deletedPlayer) {
            return res.json(deletedPlayer);
        }

        const deletedPlayerByUscf = await Player.findOneAndDelete({
            uscf_id: uscf_id
        });

        if (deletedPlayerByUscf) {
            return res.json(deletedPlayerByUscf);
        }

        // Bad request
        await res.status(400).send("Could not delete player");
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

module.exports = router;
