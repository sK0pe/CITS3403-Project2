var mongoose = require('mongoose');

var CommentSchema = new mongoose.Schema({
    author: { type: String, required: true },
    title: { type: String, required: true},
    permaLink: { type: String, required: true},
    dateCreated: {type: Date, default: Date.now },
    content: { type: String, required: true}
});

module.exports = mongoose.model("Comment", CommentSchema);