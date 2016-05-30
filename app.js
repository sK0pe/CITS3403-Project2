var express = require('express');
var session = require('express-session');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var stylus = require('stylus');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy
//  Model
var User = require('./models/user');
//  Routes
var users = require('./routes/users');
var routes = require('./routes/index');
var comments = require('./routes/comments');
//  Express
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(stylus.middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'cats are better than dogs',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

//  At all views check if user is authenticated / signed in
app.get('*', function(req, res, next){
    res.locals.signedIn = req.isAuthenticated() ? true : false;
    next();
});

//  Routes loaded after everything is loaded and authentication check
app.use('/', routes);
app.use('/user', users);
app.use('/comments', comments);

//  Passport configuration (default)
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//  Connection via mongoose to mongod
mongoose.connect('mongodb://localhost/CashStash', function(err){
    if(err){
        console.log('Failed to connect to mongodb on localhost, default port.');
    }
    else{
        console.log('Successfully connected to mongodb');
    }
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
