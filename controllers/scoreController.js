var express = require('express');
var moment = require('moment');
var Score = require('../models/score');


//  10 highest scores
module.exports.top10 = function(req, res, next){
    Score.find().sort('score').limit(10).exec(function(err, scores){
        res.render('scoresTop10', {'scores': scores, moment: moment});
    });
};


//  All Scores in descending list
module.exports.all = function(req, res, next){
    Score.find().sort('score').exec(function(err, scores){
        res.render('scoresAll', {'scores': scores, moment: moment});
    });
};


//  Post Score
module.exports.postScore = function(req, res, next){
    console.log('with body.score ' + req.body.score);
    if(!req.isAuthenticated()){ //  auth check
        //  not logged in, can't record score
        res.redirect('/user/login');
    }
    new Score({
        player: req.user.username,
        score: req.body.score
    }).save(function(err){
        if(err){
            return next(err);
        }
        else{   // Reroute to comment list once posted
            res.redirect('/scoreboard');
        }
    });
};
