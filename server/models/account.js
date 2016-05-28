/**
 * Created by Pradyumn on 26/05/2016.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// Salting and hashing done by this package
var passportLocalMongoose = require('passport-local-mongoose');

var AccountSchema = new Schema({
    username: String,
    password: String,
    highscore: Number
});

AccountSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('Account', AccountSchema);