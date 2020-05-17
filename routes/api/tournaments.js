const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const Tournament = require("../../models/Tournament");
const {check, validationResult} = require("express-validator");

// @route   GET api/tournaments
// @desc    Get user's tournaments
// @access  Private (A token is needed)
router.get("/", auth, async (req, res) => {
    try {
        // Find all tournaments of the logged in user and return specified fields
        const tournaments = await Tournament.find({user_id: req.user.id}).sort({
            date: -1
        });
        if (tournaments === []) {
            return res
                .status(400)
                .json({msg: "There are no tournaments for this user"});
        }
        // console.log("get tournaments");
        // console.log(tournaments);
        await res.json(tournaments);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// @route   GET api/tournaments
// @desc    Get a tournament
// @access  Private (A token is needed)
router.get("/:tournament_id", auth, async (req, res) => {
    try {
        const tournament = await Tournament.findById(req.params.tournament_id);
        if (tournament === []) {
            return res.status(400).json({msg: "This tournament does not exist"});
        }
        await res.json(tournament);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
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
            res.status(500).send("Server Error");
        }
    }
);

// @route   PUT api/tournaments
// @desc    Edit a tournament
// @access  Private (A token is needed)
router.put("/:id", auth, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }
    const {tournament_name, printing_name, time_control} = req.body;

    const tournamentFields = {};
    tournamentFields.user = req.user.id;
    if (tournament_name) tournamentFields.name = tournament_name;
    if (printing_name) tournamentFields.printing_name = printing_name;
    if (time_control) tournamentFields.time_control = time_control;

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
        await res.status(404).send("Tournament does not exist");
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// @route   DELETE api/tournaments/
// @desc    Delete a tournament
// @access  Private (A token is needed)
router.delete("/:tournament_id", auth, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }
    try {
        const tournament = await Tournament.findById(req.params.tournament_id);
        if (tournament.user.toString() !== req.user.id) {
            return res.status(401).json({msg: "User not authorized"});
        }
        await tournament.deleteOne();
        await res.json(tournament);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

module.exports = router;
