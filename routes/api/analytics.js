const express = require("express");
const router = express.Router();
const config = require("config");
const auth = require("../../middleware/auth");
const {check, validationResult} = require("express-validator");

const User = require("../../models/User");
const Tournament = require("../../models/Tournament");
const Section = require("../../models/Section");
const Player = require("../../models/Player");
const Resultpairing = require("../../models/Resultpairing");


// @route   GET api/analytics
// @desc    Get a user's analytics
// @access  Private (A token is needed)
router.get("/users/:user_id", auth, async (req, res) => {
    try {
        const tournaments = await Tournament.countDocuments({user_id: req.params.user_id});
        return res.json({tournaments});
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// @route   GET api/analytics
// @desc    Get entire app analytics (Admin)
// @access  Private (A token is needed)
router.get("/admin/:user_id", auth, async (req, res) => {
    try {
        // Count all documents in each collection
        const number_of_users = await User.countDocuments({});
        const number_of_tournaments = await Tournament.countDocuments({});
        const number_of_sections = await Section.countDocuments({});
        const number_of_players = await Player.countDocuments({});
        const number_of_resultpairings = await Resultpairing.countDocuments({});
        return res.json({
            number_of_users,
            number_of_tournaments,
            number_of_sections,
            number_of_players,
            number_of_resultpairings
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

module.exports = router;