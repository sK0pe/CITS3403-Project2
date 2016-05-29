/**
 * Created by Pradyumn on 26/05/2016.
 */
//var account = require('../models/account');
var Account = require('mongoose').model('Account');
var passport = require('passport');

//  Handle error message
var getErrorMessage = function(err) {
    var message = '';
    if (err.code) {
        switch (err.code) {
            case 11000:
            case 11001:
                message = 'Username already exists';
                break;
            default:
                message = 'Something went wrong';
        }
    }
    else {
        for (var e in err.errors) {
            if (err.errors[e].message)
                message = err.errors[e].message;
        }
    }
    return message;
};

//  Login get
module.exports.renderLogin = function(req, res, next) {
    if (!req.account) {
        res.render('login', {
            title: 'Log-in Form',
            messages: req.flash('error') || req.flash('info')
        });
    }
    else {
        return res.redirect('/');
    }
};


//  Register get
module.exports.renderRegister = function(req, res, next) {
    if (!req.account) {
        res.render('register', {
            title: 'Register Form',
            messages: req.flash('error')
        });
    }
    else {
        return res.redirect('/');
    }
};

//  Perform registration
module.exports.register = function(req, res, next) {
    if (!req.account) {
        var account = new Account(req.body);
        var message = null;
        account.provider = 'local';
        account.save(function(err) {
            if (err) {
                var message = getErrorMessage(err);
                req.flash('error', message);
                return res.redirect('/register');
            }

            req.login(account, function(err) {
                if (err){
                    return next(err);
                }
                return res.redirect('/');
            });
        });
    }
    else {
        return res.redirect('/');
    }
};

//  Logout
module.exports.logout = function(req, res){
    req.logout();
    res.redirect('/');
};



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




/*

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
};*/