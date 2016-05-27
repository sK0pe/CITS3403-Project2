/**
 * Created by Pradyumn on 26/05/2016.
 */
var account = require('../models/account');
var passport = require('passport');

//  Login
module.exports.login = function(req, res){
    res.render('login', {title: "Stash EvilCorp's Cash - Employee of the Minute"});
};

//***************MAY CAUSE BUGS****************
module.exports.authenticate = (passport.authenticate('local'), function(req, res){
    res.redirect('/');
});


//  Register
module.exports.register = function(req, res){
    res.render('register', {title: "Register to Stash EvilCorp's Cash"});
};

module.exports.registration = function(req, res, next){
    account.register(new account({username: req.body.username}),
        req.body.password,
        function(err, account){
            if(err){
                return res.render('register', {error : err.message});
            }
            passport.authenticate('local')(req, res, function(){
                res.session.save(function(err){
                    if(err){
                        return next(err);
                    }
                    res.redirect('/');
                });
            });
    });
};

//  Logout
module.exports.logout = function(req, res){
    req.logout();
    res.redirect('/');
};