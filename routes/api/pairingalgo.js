const express = require("express");
const router = express.Router();
const pairingengine = require('../../pairing_engine/brutus');

// Put auth middleware back

router.post("/:sectionid/:round", async (req, res) => {
    try {
        const {
            players_in_section
        } = req.body;

        return pairingengine(req.params.sectionid, req.params.round, players_in_section);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

module.exports = router;
