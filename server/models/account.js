/**
 * Created by Pradyumn on 26/05/2016.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// Salting and hashing done by this package
var passportLocalMongoose = require('passport-local-mongoose');

var AccountSchema = new Schema({
    username: {
        type: String,
        trim: true,
        unique: true
    },
    password: String,
    highscore: Number
});

AccountSchema.statics.findUniqueUsername = function(username, suffix, callback) {
    var _this = this;
    var possibleUsername = username + (suffix || '');

    _this.findOne(
        {username: possibleUsername},
        function(err, user) {
            if (!err) {
                if (!user) {
                    callback(possibleUsername);
                }
                else {
                    return _this.findUniqueUsername(username, (suffix || 0) + 1, callback);
                }
            }
            else {
                callback(null);
            }
        }
    );
};

AccountSchema.plugin(passportLocalMongoose);

mongoose.model('Account', AccountSchema);