/**
 * Created by Pradyumn on 28/05/2016.
 */
var passport = require('passport');

module.exports = function() {
    var Account = require('../server/models/account');
    
    //  Account is used
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });
    
    //  Account is not in use 
    passport.deserializeUser(function(id, done) {
        Account.findOne(
            {_id: id},
            '-password',
            function(err, user) {
                done(err, user);
            }
        );
    });

    require('./strategies/local')();
};