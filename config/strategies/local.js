/**
 * Created by Pradyumn on 28/05/2016.
 */
var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    Account = require('../../server/models/account');

module.exports = function() {
    passport.use(new LocalStrategy(function(username, password, done) {
        Account.findOne(
            {username: username},
            function(err, user) {
                if (err) {
                    return done(err);
                }
                if (!user) {
                    return done(null, false, {message: 'Unknown Employee'});
                }
                if (!user.authenticate(password)) {
                    return done(null, false, {message: 'Incorrect Password'});
                }
                return done(null, user);
            }
        );
    }));
};