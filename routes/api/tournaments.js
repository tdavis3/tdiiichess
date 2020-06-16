const express = require("express");
const mongoose = require('mongoose');
const router = express.Router();
const auth = require("../../middleware/auth");
const Tournament = require("../../models/Tournament");
const Section = require("../../models/Section");
const {check, validationResult} = require("express-validator");

// @route   GET api/tournaments
// @desc    Get user's tournaments
// @access  Private (A token is needed)
router.get("/", auth, async (req, res) => {
    try {
        // Find all tournaments of the logged in user and return specified fields
        const tournaments = await Tournament.find({user_id: req.user.id}).sort({
            start_date: -1
        });
        if (tournaments === []) {
            return res
                .status(400)
                .send({msg: "There are no tournaments for this user"});
        }
        await res.json(tournaments);
    } catch (err) {
        console.error(err.message);
        res.status(500).send({msg: "Could not retrieve tournaments."});
    }
});

// @route   GET api/tournaments
// @desc    Get a tournament
// @access  Private (A token is needed)
router.get("/:tournament_id", auth, async (req, res) => {
    try {
        const tournament = await Tournament.findById(req.params.tournament_id);
        if (tournament === []) {
            return res.status(400).send({msg: "This tournament does not exist"});
        }
        await res.json(tournament);
    } catch (err) {
        console.error(err.message);
        res.status(500).send({msg: "Could not retrieve tournament."});
    }
});

// @route   POST api/tournaments
// @desc    Create a tournament
// @access  Private (A token is needed)
router.post(
    "/",
    [
        auth,
        [
            check("name", "Tournament name is required")
                .not()
                .isEmpty()
        ]
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }

        const {name, printing_name, time_control, start_date, end_date} = req.body;

        const tournamentFields = {};
        tournamentFields.user_id = req.user.id;
        if (name) tournamentFields.name = name;
        if (printing_name) tournamentFields.printing_name = printing_name;
        if (time_control) tournamentFields.time_control = time_control;
        if (start_date) tournamentFields.start_date = start_date;
        if (end_date) tournamentFields.end_date = end_date;

        try {
            let tournament = new Tournament(tournamentFields);
            await tournament.save();
            await res.json(tournament);
        } catch (err) {
            console.error(err.message);
            res.status(500).send({msg: "Could not add tournament. Try again!"});
        }
    }
);

// @route   PUT api/tournaments
// @desc    Edit a tournament
// @access  Private (A token is needed)
router.put("/:id", auth, async (req, res) => {
    const {name, printing_name, time_control, start_date, end_date} = req.body;
    const tournamentFields = {};
    tournamentFields.user = req.user.id;
    if (name) tournamentFields.name = name;
    if (printing_name) tournamentFields.printing_name = printing_name;
    if (time_control) tournamentFields.time_control = time_control;
    if (start_date) tournamentFields.start_date = start_date;
    if (end_date) tournamentFields.end_date = end_date;
    try {
        // Returns the new updated tournament object
        const updated_tournament = await Tournament.findByIdAndUpdate(
            req.params.id,
            {$set: tournamentFields},
            {new: true}
        );
        if (updated_tournament) {
            return res.json(updated_tournament);
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send({msg: "Could not edit tournament. Try again!"});
    }
});

// @route   POST api/tournaments/
// @desc    Duplicate a tournament
// @access  Private (A token is needed)
router.post("/:tournamentId/duplicate", auth, async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        let tournament = await Tournament.findById(req.params.tournamentId, {_id: 0}).session(session);
        tournament.isNew = true;

        async function asyncForEach(array, callback) {
            let outputArray = [];
            for (let index = 0; index < array.length; index++) {
                const newSectionId = await callback(array[index], index, array);
                outputArray.push(newSectionId);
            }
            return outputArray;
        }

        const newSectionIds = await asyncForEach(tournament.section_ids, async (sectionId) => {
            let section = await Section.findById(sectionId, {_id: 0}).session(session);
            section.isNew = true;
            const duplicatedSection = new Section(section);
            const savedDuplicatedSection = await duplicatedSection.save({session});
            return savedDuplicatedSection._id;
        });
        tournament.section_ids = newSectionIds;
        const duplicatedTournament = new Tournament(tournament);
        const savedDuplicatedTournament = await duplicatedTournament.save({session});
        await session.commitTransaction();
        session.endSession();
        return res.json(savedDuplicatedTournament);
    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        console.error(err.message);
        res.status(500).send({msg: "Could not duplicate the tournament. Try again!"});
    }
});

// @route   DELETE api/tournaments/
// @desc    Delete a tournament
// @access  Private (A token is needed)
router.delete("/:tournamentId", auth, async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const tournament = await Tournament.findById(req.params.tournamentId).session(session);
        await tournament.deleteOne({session});  // Will trigger cascade deletion of Sections
        await session.commitTransaction()
        session.endSession();
        await res.json(tournament._id);
    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        console.error(err.message);
        res.status(500).send({msg: "Could not delete tournament. Try again!"});
    }
});

module.exports = router;
