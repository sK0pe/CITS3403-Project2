
var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password:{
      type: String,
      required: true
    }
});

var commentSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    }.
    comment: {
        type: String,
        required: true
    },
    dateTime: {
        type: Date,
        required: true,
        "default": Date.now
    }
})

mongoose.model('user', userSchema);
mongoose.model('comment', commentSchema);