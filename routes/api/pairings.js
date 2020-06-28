const express = require("express");
const router = express.Router();
const AugustusEngine = require('../../pairing_engine/augustus');
const players = require('../../pairing_engine/testData');


// @route   GET api/pairings/
// @desc    Get a pairing
// @access  Private (A token is needed)
// Don't forget to put the auth middleware back
router.get("/:sectionid/:round", async (req, res) => {
    try {
        const {
            players_in_section
        } = req.body;
        let augustusEngine = new AugustusEngine(req.params.sectionid, req.params.round, players);
        const pairings = augustusEngine.generatePairings();
        return res.json();
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

module.exports = router;
