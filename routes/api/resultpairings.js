const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const Resultpairing = require("../../models/Resultpairing");

// @route   GET api/resultpairings
// @desc    Get all resultpairings for specific round
// @access  Private (A token is needed)
router.get("/:section_id/:round_number", auth, async (req, res) => {
    try {
        const resultpairings = await Resultpairing.find({
            section_id: req.params.section_id,
            round_number: req.params.round_number
        });

        if (resultpairings) {
            return res.json(resultpairings);
        }
        await res
            .status(404)
            .json({msg: "No results/pairings found in this section"});
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// @route   POST api/resultpairings
// @desc    Create/add resultpairings for specific round
// @access  Private (A token is needed)
router.post("/:section_id/:round_number", auth, async (req, res) => {
    const {
        player_one_id,
        player_two_id,
        player_one_color,
        player_two_color,
        player_one_result,
        player_two_result
    } = req.body;

    const resultPairingFields = {};

    resultPairingFields.round_number = req.params.round_number;
    resultPairingFields.section_id = req.params.section_id;

    if (player_one_id) resultPairingFields.player_one_id = player_one_id;
    if (player_two_id) resultPairingFields.player_two_id = player_two_id;
    if (player_one_color) resultPairingFields.player_one_color = player_one_color;
    if (player_two_color) resultPairingFields.player_two_color = player_two_color;
    if (player_one_result) resultPairingFields.player_one_result = player_one_result;
    if (player_two_result) resultPairingFields.player_two_result = player_two_result;

    try {
        let resultpairing = new Resultpairing(resultPairingFields);
        const savedresultpairing = await resultpairing.save();

        if (savedresultpairing) {
            return res.json(savedresultpairing);
        }
        await res
            .status(404)
            .json({msg: "Could not create this result/pairing in this section"});
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// @route   PUT api/resultpairings
// @desc    Edit resultpairings for specific round
// @access  Private (A token is needed)
router.put("/:resultpairing_id", auth, async (req, res) => {
    const {
        player_one_id,
        player_two_id,
        player_one_color,
        player_two_color,
        player_one_result,
        player_two_result
    } = req.body;

    const resultPairingFields = {};

    if (player_one_id) resultPairingFields.player_one_id = player_one_id;
    if (player_two_id) resultPairingFields.player_two_id = player_two_id;
    if (player_one_color) resultPairingFields.player_one_color = player_one_color;
    if (player_two_color) resultPairingFields.player_two_color = player_two_color;
    if (player_one_result) resultPairingFields.player_one_result = player_one_result;
    if (player_two_result) resultPairingFields.player_two_result = player_two_result;

    try {
        const newresultpairing = await Resultpairing.findByIdAndUpdate(
            req.params.resultpairing_id,
            {
                $set: resultPairingFields
            },
            {new: true}
        );

        if (newresultpairing) {
            return res.json(newresultpairing);
        }
        await res.status(400).json({msg: "Could not edit this result/pairing"});
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// @route   DELETE api/resultpairings
// @desc    Delete resultpairings for specific round
// @access  Private (A token is needed)
router.delete("/:resultpairing_id", auth, async (req, res) => {
    try {
        const deletedresultpairing = await Resultpairing.findByIdAndDelete(
            req.params.resultpairing_id
        );

        if (deletedresultpairing) {
            return res.json(deletedresultpairing);
        }
        await res.status(400).json({msg: "Could not delete this result/pairing"});
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

module.exports = router;
