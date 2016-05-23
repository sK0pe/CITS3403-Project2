/**
 * Created by Pradyumn on 24/05/2016.
 */
var mongoose = require('mongoose');

// Very basic schema, if have more time, include how many times
// a tetris is scored also could save a twitter handle
var scoreSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password:{
      type: String,
      required: true
    },
    highscore: {
        type: Number,
        required: true,
        min: 0,
        max: 1000000000
    },
    lowscore:{
        type: Number,
        required: true,
        min: 0,
        max: 1000000000
    },
    date:{
        type: Date,
        "default": Date.now
    },
    rank:{
        type: Number,
        required: true
    }
});

mongoose.model('scoreboard', scoreSchema);