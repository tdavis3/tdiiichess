const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const Tournament = require("../../models/Tournament");
const Section = require("../../models/Section");
const {check, validationResult} = require("express-validator");


// @route   GET api/sections
// @desc    Get all sections in a tournament
// @access  Private (A token is needed)
router.get("/:tournamentId", auth, async (req, res) => {
    try {
        // Only select the sections field
        const sections = await Tournament.findById(req.params.tournamentId)
            .populate({
                path: "section_ids",
                model: "Section",
                populate: {
                    path: "players.player_id",
                    model: "Player"
                }
            })
            .select("section_ids");
        if (sections) {
            return res.json(sections.section_ids);
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send({msg: "Could not retrieve sections."});
    }
});

// @route   POST api/sections
// @desc    Create a new section
// @access  Private (A token is needed)
router.post(
    "/:tournamentId",
    [
        auth,
        [
            check("name", "Section name is required")
                .not()
                .isEmpty(),
            check("event_type", "Event type is required")
                .not()
                .isEmpty(),
            check("style", "Style is required")
                .not()
                .isEmpty(),
            check("rating_type", "Rating type is required")
                .not()
                .isEmpty()
        ]
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }
        const {
            name,
            printing_name,
            event_type,
            style,
            rating_type,
            coin_toss,
            time_control,
            number_of_rounds
        } = req.body;

        const sectionFields = {};

        sectionFields.tournament_id = req.params.tournamentId;
        if (name) sectionFields.name = name;
        if (printing_name) sectionFields.printing_name = printing_name;
        if (event_type) sectionFields.event_type = event_type;
        if (style) sectionFields.style = style;
        if (rating_type) sectionFields.rating_type = rating_type;
        if (coin_toss) sectionFields.coin_toss = coin_toss;
        if (time_control) sectionFields.time_control = time_control;
        if (number_of_rounds) sectionFields.number_of_rounds = number_of_rounds;

        try {
            const section = new Section(sectionFields);
            const savedSection = await section.save();

            const updatedTournament = await Tournament.findByIdAndUpdate(
                req.params.tournamentId,
                {
                    $push: {
                        section_ids: savedSection._id
                    }
                },
                {new: true}
            );

            if (savedSection && updatedTournament) {
                return res.json(savedSection);
            }
            await res
                .status(404)
                .json({msg: "No sections found in this tournament"});
        } catch (err) {
            console.error(err.message);
            res.status(500).send({msg: "Could not create section. Try again!"});
        }
    }
);

// @route   PUT api/sections/
// @desc    Edit a section
// @access  Private (A token is needed)
router.put("/:sectionId", auth, async (req, res) => {
    const {
        name,
        printing_name,
        event_type,
        style,
        rating_type,
        coin_toss,
        time_control,
        number_of_rounds
    } = req.body;

    const sectionFields = {};

    if (name) sectionFields.name = name;
    if (printing_name) sectionFields.printing_name = printing_name;
    if (event_type) sectionFields.event_type = event_type;
    if (style) sectionFields.style = style;
    if (rating_type) sectionFields.rating_type = rating_type;
    if (coin_toss) sectionFields.coin_toss = coin_toss;
    if (time_control) sectionFields.time_control = time_control;
    if (number_of_rounds) sectionFields.number_of_rounds = number_of_rounds;

    try {
        // Returns the updated section
        const updatedsection = await Section.findByIdAndUpdate(
            req.params.sectionId,
            {$set: sectionFields},
            {new: true}
        );
        if (updatedsection) {
            return res.json(updatedsection);
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send({msg: "Could not edit section. Try again!"});
    }
});

// @route   POST api/sections/
// @desc    Duplicate a section
// @access  Private (A token is needed)
router.post("/:sectionId/duplicate", auth, async (req, res) => {
    try {
        let section = await Section.findById(req.params.sectionId, {_id: 0});
        section.isNew = true;
        const duplicatedSection = new Section(section);
        const savedDuplicatedSection = await duplicatedSection.save();
        await Tournament.findByIdAndUpdate(
            savedDuplicatedSection.tournament_id,
            {
                $push: {
                    section_ids: savedDuplicatedSection._id
                }
            },
            {new: true}
        );
        const finalDuplicatedSection = await savedDuplicatedSection.populate({
            path: "players.player_id",
            model: "Player"
        }).execPopulate();
        return res.json(finalDuplicatedSection);
    } catch (err) {
        console.error(err.message);
        res.status(500).send({msg: "Could not delete section. Try again!"});
    }
});

// @route   DELETE api/sections/
// @desc    Delete a section
// @access  Private (A token is needed)
router.delete("/:sectionId", auth, async (req, res) => {
    try {
        const section = await Section.findById(req.params.sectionId);
        if (section) {
            section.deleteOne(); // doc.deleteOne() - This should cascade delete
            return res.json(section);
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send({msg: "Could not delete section. Try again!"});
    }
});

module.exports = router;
