const mongoose = require("mongoose");

const TournamentSchema = new mongoose.Schema({
    user_id: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    name: {
        type: String,
        required: true
    },
    printing_name: {
        type: String
    },
    start_date: {
        type: Date
    },
    end_date: {
        type: Date
    },
    time_control: {
        type: String
    },
    section_ids: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Section"
        }
    ],
    date: {
        type: Date,
        default: Date.now()
    }
});

TournamentSchema.pre(
    "deleteOne",
    {document: true, query: false},
    async function (next) {
        try {
            // Delete each section referenced in this Tournament
            for (sectionId of this.section_ids) {
                const section = await mongoose.model("Section").findById(sectionId);
                section.deleteOne();
            }
            next();
        } catch (err) {
            console.error(err);
            next(err);
        }
    }
);

module.exports = Tournament = mongoose.model("Tournament", TournamentSchema);
