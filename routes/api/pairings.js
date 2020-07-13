const express = require("express");
const router = express.Router();
const players = require('../../pairing_engine/testData');


// @route   POST api/pairings/
// @desc    Get a pairing
// @access  Private (A token is needed)
// Don't forget to put the auth middleware back
router.post("/:sectionId/:round", async (req, res) => {
    try {
        const {
            players_in_section
        } = req.body;

        /*
        Consider making an axios request directly from the frontend (Instead of this wrapper route)
        - No API Key required

        URL Params:
            sectionId
            round

        Body:
            players

        Request URL: (AWS Lambda function)
            https://api.tdiiichess.com/pairingEngine?sectionId={PARAM}&round={PARAM}
        Response:
            List of (length 2) lists - Pairings
         */

        return res.json();
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

module.exports = router;
