const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const Tournament = require("../../models/Tournament");
const Section = require("../../models/Section");
const {check, validationResult} = require("express-validator");


// @route   GET api/sections
// @desc    Get all sections in a tournament
// @access  Private (A token is needed)
router.get("/:tournament_id", auth, async (req, res) => {
    try {
        // Only select the sections field
        const sections = await Tournament.findById(req.params.tournament_id)
            // .populate("section_ids")
            .populate({
                path: "section_ids",
                model: "Section",
                populate: {
                    path: "players.player_id",
                    model: "Player"
                }
            })
            .select("section_ids");
        // console.log("print sections api")
        // console.log(sections.section_ids[0].players);
        if (sections) {
            return res.json(sections.section_ids);
        }

        await res.status(404).json({msg: "No sections found in this tournament"});
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// @route   POST api/sections
// @desc    Create a new section
// @access  Private (A token is needed)
router.post(
    "/:tournament_id",
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

        sectionFields.tournament_id = req.params.tournament_id;
        if (name) sectionFields.name = name;
        if (printing_name) sectionFields.printing_name = printing_name;
        if (event_type) sectionFields.event_type = event_type;
        if (style) sectionFields.style = style;
        if (rating_type) sectionFields.rating_type = rating_type;
        if (coin_toss) sectionFields.coin_toss = coin_toss;
        if (time_control) sectionFields.time_control = time_control;
        if (number_of_rounds) sectionFields.number_of_rounds = number_of_rounds;

        try {
            // TODO - Check if a section with the same name exists
            const section = new Section(sectionFields);
            const savedsection = await section.save();

            const updatedtournament = await Tournament.findByIdAndUpdate(
                req.params.tournament_id,
                {
                    $push: {
                        section_ids: savedsection._id
                    }
                },
                {new: true}
            );

            if (savedsection && updatedtournament) {
                return res.json(savedsection);
            }
            await res
                .status(404)
                .json({msg: "No sections found in this tournament"});
        } catch (err) {
            console.error(err.message);
            await res.status(500).send("Server Error");
        }
    }
);

// @route   PUT api/sections/
// @desc    Edit a section
// @access  Private (A token is needed)
router.put("/:section_id", auth, async (req, res) => {
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
            req.params.section_id,
            {$set: sectionFields},
            {new: true}
        );
        if (updatedsection) {
            return res.json(updatedsection);
        }
        await res.status(404).json({errors: "This section not found"});
    } catch (err) {
        console.error(err.message);
        await res.status(500).send("Server Error");
    }
});

// @route   DELETE api/sections/
// @desc    Delete a section
// @access  Private (A token is needed)
router.delete("/:section_id", auth, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    try {
        const section = await Section.findById(req.params.section_id);

        if (section) {
            section.deleteOne(); // doc.deleteOne() - This should cascade delete
            return res.json(section);
        }
        await res.status(400).json({errors: "Delete failure"});
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

module.exports = router;
