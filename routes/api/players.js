const express = require("express");
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
router.get("/playerget/:player_id", auth, async (req, res) => {
    try {
        const player = await Player.findById(req.params.player_id);
        if (player) {
            return res.json(player);
        }
        await res.status(404).json({msg: "No player found"});
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// @route   GET api/players
// @desc    Get all players from a section
// @access  Private (A token is needed)
router.get("/:section_id", auth, async (req, res) => {
    try {
        const players = await Section.findById(req.params.section_id)
            .populate("players.player_id")
            .select("players");
        if (players) {
            // Return ARRAY of players in the specified section
            return res.json(players.players);
        }
        await res.status(404).json({msg: "No players in this section"});
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// @route   POST api/players
// @desc    Add player to a section
// @access  Private (A token is needed)
router.post("/:section_id", auth, async (req, res) => {
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
            if (playerobject.firstname)
                playerFields.first_name = playerobject.firstname;
            if (playerobject.lastname) playerFields.last_name = playerobject.lastname;
            if (playerobject.suffix) playerFields.suffix = playerobject.suffix;
            if (playerobject.uscfid) playerFields.uscf_id = playerobject.uscfid;
            if (playerobject.regrating)
                playerFields.uscf_reg_rating = playerobject.regrating;
            if (playerobject.blitzrating)
                playerFields.uscf_blitz_rating = playerobject.blitzrating;
            if (playerobject.quickrating)
                playerFields.uscf_quick_rating = playerobject.quickrating;
            if (playerobject.state) playerFields.state = playerobject.state;
            if (playerobject.expires) playerFields.expires = playerobject.expires;
            if (playerobject.fidecountry)
                playerFields.fide_country = playerobject.fidecountry;
            if (playerobject.fideid) playerFields.fide_id = playerobject.fideid;
            if (email) playerFields.email = email;
            if (cell) playerFields.cell = cell;
            if (dob) playerFields.dob = dob;
        }
        try {
            const player = new Player(playerFields);
            const savedplayer = await player.save();

            const updated_section = await Section.findByIdAndUpdate(
                req.params.section_id,
                {
                    $push: {
                        players: {
                            player_id: savedplayer._id,
                            total_points: 0,
                            withdrew: false
                        }
                    }
                }, {new: true}
            ).populate("players.player_id");
            if (savedplayer && updated_section) {
                return res.json(updated_section);
            }
            res.status(404).json({errors: "This section does not exist"});
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Server Error");
        }
    });
});

// @route   PUT api/players
// @desc    Edit player in a section
// @access  Private (A token is needed)
router.put("/:player_id", auth, async (req, res) => {
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
    const separateplayerFields = {};

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
            req.params.player_id,
            {
                $set: playerFields
            },
            {new: true}
        );
        // Update section specific player fields in another route
        // separateplayerFields.player_id = updatedPlayer._id;
        //
        // const updatedSectionPlayer = await Section.findByIdAndUpdate(
        //   updatedPlayer.section_id,
        //   { $set: { "players.$[player]": separateplayerFields } },
        //   {
        //     new: true,
        //     arrayFilters: [{ "player.player_id": { $eq: req.params.player_id } }]
        //   }
        // );
        if (updatedPlayer) {
            // TODO - Add the separateplayerFields to the updatedPlayer object
            return res.json(updatedPlayer);
        }
        await res.status(404).send("Could not find player");
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// @route   PUT api/players
// @desc    Delete player from a section
// @access  Private (A token is needed)
router.put("/:section_id/:play_id", auth, async (req, res) => {
    try {
        const updatedsection = await Section.findByIdAndUpdate(
            req.params.section_id,
            {
                $pull: {players: {player_id: req.params.play_id}}
            },
            {new: true, multi: true}
        );
        if (updatedsection) {
            return res.send(updatedsection);
        }
        await res.status(400).send("Could not delete player");
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// @route   POST api/players
// @desc    Add a player
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
        if (playerobject.firstname) playerFields.first_name = playerobject.firstname;
        if (playerobject.lastname) playerFields.last_name = playerobject.lastname;
        if (playerobject.regrating)
            playerFields.uscf_reg_rating = playerobject.regrating;
        if (playerobject.blitzrating)
            playerFields.uscf_blitz_rating = playerobject.blitzrating;
        if (playerobject.quickrating)
            playerFields.uscf_quick_rating = playerobject.quickrating;
        if (playerobject.state) playerFields.state = playerobject.state;
        if (playerobject.expires) playerFields.expires = playerobject.expires;
        if (playerobject.fidecountry)
            playerFields.fide_country = playerobject.fidecountry;
        if (playerobject.fideid) playerFields.fide_id = playerobject.fideid;
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
        res.status(400).json({errors: "Cannot add player"});
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// @route   DELETE api/players
// @desc    Delete a player
// @access  Private (A token is needed)
router.delete("/:player_id", auth, async (req, res) => {
    const {uscf_id} = req.body;

    try {
        const deletedplayer = await Player.findByIdAndDelete(req.params.player_id);

        if (deletedplayer) {
            return res.json(deletedplayer);
        }

        const deletedplayerbyuscf = await Player.findOneAndDelete({
            uscf_id: uscf_id
        });

        if (deletedplayerbyuscf) {
            return res.json(deletedplayerbyuscf);
        }

        // Bad request
        await res.status(400).send("Could not delete player");
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

module.exports = router;
