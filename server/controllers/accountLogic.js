/**
 * Created by Pradyumn on 26/05/2016.
 */
var account = require('../models/account');
var passport = require('passport');

//  Login
module.exports.login = function(req, res){
    res.render('login', {title: "Stash EvilCorp's Cash - Employee of the Minute"});
};


module.exports.authenticate = function(req, res, next){
    passport.authenticate('local', function(err, user, info){
        if(err){
            return next(err); // 500 error
        }
        if(!user){
            // Failed to login
            //return res.send(401, {success : false, message: 'authentication failed'});
            res.redirect('/');
        }
        req.login(user, function(err){
            if(err){
                return next(err);
            }
            //return res.send({ success : true, message : 'authentication succeeded'});
            //  Send to play game
            res.redirect('/game');
        });
    })(req, res, next);
};


//  Register
module.exports.register = function(req, res){
    res.render('register', {title: "Register to Stash EvilCorp's Cash"});
};

module.exports.newPlayer = function(req, res, next){
    account.register(new account({username: req.body.username}),
        req.body.password,
        function(err, account){
            if(err){
                console.log(err);
                return res.status(500).json({err:err});
                //return res.render('register', {error : err.message});
            }
            // else save data but check first
            passport.authenticate('local')(req, res, function(){
                req.session.save(function(err){
                    if(err){
                        return next(err);   //500 error
                    }
                    //  successfully saved
                    console.log('saved');
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