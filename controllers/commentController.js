var express = require('express');
var moment = require('moment');
var Comment = require('../models/comment');

//  Most Recent 10 comments
module.exports.top10 = function(req, res, next){
    Comment.find().sort('-dateCreated').limit(10).exec(function(err, comments){
        res.render('commentsTop10', { 'comments': comments, moment: moment});
    });
};

//  All comments
module.exports.all = function(req, res, next){
    Comment.find().sort('-dateCreated').exec(function(err, comments){
        res.render('commentsAll', {'comments': comments, moment: moment});
    });
};

//  Create Comment
module.exports.createComment = function(req, res, next){
    if(!req.isAuthenticated()){ //  If not signed in send to sign in page
        return res.redirect('/user/login');
    }
    //  Else create
    res.render('writeComment');
};


//  Create permalink, remove invalid characters from title
//  Easily referenced and stored, lowercase, no spaces
function createPermaLink(title) {
    return title.replace(/[^a-zA-Z0-9\s]/g, '')
        .replace(/^\s+|\s+$/, '')
        .replace(/\s+/g, '-')
        .toLowerCase();
};


//  Post comment
module.exports.postComment = function(req, res, next){
    if(!req.isAuthenticated()){ //  auth check
        return res.redirect('/user/login');
    }
    
    new Comment({
        author: req.user.username,
        title: req.body.title,
        permaLink: createPermaLink(req.body.title),
        content: req.body.content
    }).save(function(err, newPost){
        if(err){
            return next(err);
        }
        else{   // Reroute to comment list once posted
            res.redirect('/comments/' + newPost.permaLink);
        }
    });
};

//  Get particular comment
module.exports.getComment = function(req, res, next){
    Comment.findOne({ permaLink: req.params.permaLink}).exec(
        function(err, comment){
            if(err){
                return next(err);
            }
            res.render('comment', comment);
        });
};