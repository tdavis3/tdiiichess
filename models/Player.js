const mongoose = require("mongoose");

const PlayerSchema = new mongoose.Schema({
    first_name: {
        type: String,
        default: '',
        required: true
    },
    middle_name: {
        type: String,
        default: ''
    },
    last_name: {
        type: String,
        default: ''
    },
    suffix: {
        type: String,
        default: ''
    },
    state: {
        type: String
    },
    uscf_id: {
        type: Number
    },
    uscf_reg_rating: {
        type: String
    },
    uscf_blitz_rating: {
        type: String
    },
    uscf_quick_rating: {
        type: String
    },
    expires: {
        type: String
    },
    fide_id: {
        type: Number
    },
    fide_rating: {
        type: String
    },
    fide_country: {
        type: String
    },
    email: {
        type: String
    },
    cell: {
        type: String
    },
    dob: {
        type: Date
    },
    date: {
        type: Date,
        default: Date.now()
    }
});

PlayerSchema.pre("deleteOne",
    {document: true, query: false},
    async function (next) {
        try {
            // You don't want to delete the player ref from the section when you delete a player
            // await mongoose.model("Section").findByIdAndUpdate(this.section_id, {
            //   $pull: { players: { player_id: this._id } }
            // });

            // await mongoose.model("Resultpairing").findOneAndDelete({
            //   $or: [{ player_one_id: this._id }, { player_two_id: this._id }]
            // });
            next();
        } catch (err) {
            next(err);
        }
    });

module.exports = Player = mongoose.model("Player", PlayerSchema);
