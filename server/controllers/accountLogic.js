/**
 * Created by Pradyumn on 26/05/2016.
 */
var account = require('../models/account');
var passport = require('passport');



var Account = require('mongoose').model('Account');
//  Create
module.exports.create = function(req, res, next) {
    var user = new Account(req.body);
    user.save(function(err) {
        if (err) {
            return next(err);
        }
        else {
            res.json(user);
        }
    });
};

//  Find all users
module.exports.list = function(req, res, next) {
    //  No specified request will receive all accounts
    Account.find({}, function(err, users) {
        if (err) {
            return next(err);
        }
        else {
            res.json(users);
        }
    });
};

//  Responds with json version of req.account
module.exports.read = function(req, res) {
    res.json(req.account);
};

//  Find one user
module.exports.userByID = function(req, res, next, id) {
    Account.findOne({
            _id: id
        },
        function(err, account) {
            if (err) {
                return next(err);
            }
            else {
                req.account = account;
                next();
            }
        }
    );
};

//  Update
module.exports.update = function(req, res, next) {
    Account.findByIdAndUpdate(req.account.id, req.body, function(err, account) {
        if (err) {
            return next(err);
        }
        else {
            res.json(account);
        }
    });
};


//  Delete Account
module.exports.delete = function(req, res, next) {
    req.account.remove(function(err) {
        if (err) {
            return next(err);
        }
        else {
            res.json(req.account);
        }
    })
};






//  Login
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