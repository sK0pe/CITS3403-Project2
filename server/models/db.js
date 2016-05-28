/**
 * Created by Pradyumn on 24/05/2016.
 */
var mongoose = require('mongoose');
//  Connect mongoose to the database
var uri = 'mongodb://localhost/CashStash';
mongoose.connect(uri);

// Basic checks to see if Mongoose is working
mongoose.connection.on('connected', function() {
    console.log('Mongoose connected to ' + uri);
});
mongoose.connection.on('error', function(err) {
    console.log('Mongoose connection error: ' + err);
});
mongoose.connection.on('disconnected', function() {
    console.log('Mongoose disconnected');
});

// Similar to TCP and SSL the app needs to close gracefully
// lets developer know why termination occurs
var gracefulShutdown = function(message, callback){
    mongoose.connection.close(function(){
        // Notification purposese
        console.log('Mongoose disconnected: ' + message);
        callback();
    });
};
// App termination
process.on('SIGINT', function(){
    gracefulShutdown('Application terminated.', function(){
        process.exit(0);
    });
});


// Import database schemas and models
require('./scoreboard');

