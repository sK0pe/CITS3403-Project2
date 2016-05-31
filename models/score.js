var mongoose = require('mongoose');

var ScoreSchema = new mongoose.Schema({
    player: { type: String, required: true },
    score: { type: String, required: true},
    dateCreated: {type: Date, default: Date.now }
});

module.exports = mongoose.model("Score", ScoreSchema);