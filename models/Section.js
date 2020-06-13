const mongoose = require("mongoose");

const SectionSchema = new mongoose.Schema({
    tournament_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tournament",
        required: true
    },
    name: {
        type: String,
        required: true
    },
    printing_name: {
        type: String
    },
    event_type: {
        type: String,
        required: true
    },
    style: {
        type: String,
        required: true
    },
    rating_type: {
        type: String,
        required: true
    },
    coin_toss: {
        type: String
    },
    time_control: {
        type: String
    },
    current_round: {
        type: Number,
        default: 0
    },
    number_of_rounds: {
        type: Number
    },
    players: [
        {
            player_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Player",
                required: true
            },
            total_points: {type: Number},
            withdrew: {
                type: Boolean,
                default: false
            },
            able_to_pair: {
                type: Boolean,
                default: true
            },
            byes: [
                {
                    round_number: {type: Number},
                    bye_point: {type: Number}

                }
            ],
            previous_opponents: [
                {
                    previous_opponent_id: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "Player",
                        required: true
                    }
                }
            ]
        }
    ],
});

// Before a section is deleted (which is why its a "pre" hook), delete all of its dependencies
SectionSchema.pre("deleteOne",
    {document: true, query: false},
    async function (next) {
        try {
            // Delete each player referenced in this Section
            // for (player of this.players) {
            //   await mongoose.model("Player").findByIdAndDelete(player.player_id);
            // }
            await mongoose.model("Tournament").findByIdAndUpdate(this.tournament_id, {
                $pull: {section_ids: this._id}
            });
            await mongoose.model("Resultpairing").deleteMany({section_id: this._id});
            next();
        } catch (err) {
            console.error(err);
            next(err);
        }
    });

module.exports = Section = mongoose.model("Section", SectionSchema);
