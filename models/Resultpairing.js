const mongoose = require("mongoose");

const ResultpairingSchema = mongoose.Schema({
    player_one_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Player",
        required: true
    },
    player_two_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Player",
        required: true
    },
    section_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Section",
        required: true
    },
    round_number: {
        type: Number,
        required: true
    },
    player_one_color: {
        type: String
    },
    player_two_color: {
        type: String
    },
    player_one_result: {
        type: Number,
        default: 0
    },
    player_two_result: {
        type: Number,
        default: 0
    },
    date: {
        type: Date,
        default: Date.now()
    }
});

module.exports = Resultpairing = mongoose.model(
    "Resultpairing",
    ResultpairingSchema
);
