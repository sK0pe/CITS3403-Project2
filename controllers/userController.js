var express = require('express');
var passport = require('passport');
var User = require('../models/user');

//  Go to Registration Page
module.exports.getRegistration = function(req, res, next){
    if(req.isAuthenticated()){  //  Already signed in, reroute
        return res.redirect('/');
    }
    res.render('register', {title: "Stash EvilCorp's Cash - Registration"});
};

//  Register User
module.exports.postRegistration = function(req, res, next){
    if(req.isAuthenticated()){  //  Aready signed in
        return res.redirect('/');
    }

    User.register(new User({ username: req.body.username}), req.body.password, function (err){
        if(err){    //  Error on trying to register, return to register
            return res.render('register', { error: err.message});
        }
        //  Authenticate using local strategy
        passport.authenticate('local')(req, res, function (){
            //  Redirect to home
            res.redirect('/');
        });
    });
};

//  Go to login Page
module.exports.getLogin = function(req, res, next){
    if(req.isAuthenticated()){  //  If already signed in reroute
        return res.redirect('/');
    }
    res.render('login', {title : "Stash EvilCorp's Cash - Login"});
};

//  Login User
module.exports.postLogin = function(req, res, next){
    if(req.isAuthenticated()){  //  Cannot login if already logged in
        return res.redirect('/');
    }
    //  Passport authentication logic
    passport.authenticate('local', function(err, user, info){
        if(err){    //  Error on login try again
            return res.render('login', { error: err.message});
        }
        if(!user){  //  Either password or username are incorrect
            return res.render('login', { error: 'Invalid Employee Name or Password'});
        }
        req.logIn(user, function(err){
            if(err){    // Login error
                return next(err);
            }
            //  Successful login
            return res.redirect('/');
        });
    })(req, res, next);
};

//  Logout User
module.exports.getLogout = function(req, res){
    req.logout();
    res.redirect('/background');
};