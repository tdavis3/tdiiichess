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
        await res.status(404).send({msg: "No player found"});
    } catch (err) {
        console.error(err.message);
        res.status(500).send({msg: "Could not retrieve player."});
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
    } catch (err) {
        console.error(err.message);
        res.status(500).send({msg: "Player all players could not be retrieved."});

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
            if (playerobject.firstName)
                playerFields.first_name = playerobject.firstName;
            if (playerobject.middleName)
                playerFields.middle_name = playerobject.middleName;
            if (playerobject.lastName) playerFields.last_name = playerobject.lastName;
            if (playerobject.suffix) playerFields.suffix = playerobject.suffix;
            if (playerobject.uscfId) playerFields.uscf_id = playerobject.uscfId;
            if (playerobject.regRating)
                playerFields.uscf_reg_rating = playerobject.regRating;
            if (playerobject.blitzRating)
                playerFields.uscf_blitz_rating = playerobject.blitzRating;
            if (playerobject.quickRating)
                playerFields.uscf_quick_rating = playerobject.quickRating;
            if (playerobject.state) playerFields.state = playerobject.state;
            if (playerobject.expires) playerFields.expires = playerobject.expires;
            if (playerobject.fideCountry)
                playerFields.fide_country = playerobject.fideCountry;
            if (playerobject.fideId) playerFields.fide_id = playerobject.fideId;
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
        } catch (err) {
            console.error(err.message);
            res.status(500).send({msg: "Player could not be added. Try again!"});
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
    } catch (err) {
        console.error(err.message);
        res.status(500).send({msg: "Player could not be edited. Try again!"});
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
        // Use transactions to maintain atomicity
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
        /*
         TODO:
          Consider adding a check here to ensure that all changes were ACTUALLY made by inspecting the rawResult -
           nModified, nChanged, etc.
         */
        res.json({msg: "Player moved successfully", updatedOldSection, updatedNewSection});
    } catch (err) {
        await session.abortTransaction();
        console.error(err.message);
        res.status(500).send({msg: "Player could not be moved. Try again!"});
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
    } catch (err) {
        console.error(err.message);
        res.status(500).send({msg: "Could not delete player. Try again!"});
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
        if (playerobject.firstName)
            playerFields.first_name = playerobject.firstName;
        if (playerobject.middleName)
            playerFields.middle_name = playerobject.middleName;
        if (playerobject.lastName) playerFields.last_name = playerobject.lastName;
        if (playerobject.suffix) playerFields.suffix = playerobject.suffix;
        if (playerobject.uscfId) playerFields.uscf_id = playerobject.uscfId;
        if (playerobject.regRating)
            playerFields.uscf_reg_rating = playerobject.regRating;
        if (playerobject.blitzRating)
            playerFields.uscf_blitz_rating = playerobject.blitzRating;
        if (playerobject.quickRating)
            playerFields.uscf_quick_rating = playerobject.quickRating;
        if (playerobject.state) playerFields.state = playerobject.state;
        if (playerobject.expires) playerFields.expires = playerobject.expires;
        if (playerobject.fideCountry)
            playerFields.fide_country = playerobject.fideCountry;
        if (playerobject.fideId) playerFields.fide_id = playerobject.fideId;
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
    } catch (err) {
        console.error(err.message);
        res.status(500).send({msg: "Could not add player to internal Players db."});
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
    } catch (err) {
        console.error(err.message);
        res.status(500).send({msg: "Could not delete player from internal Players db"});
    }
});

module.exports = router;
