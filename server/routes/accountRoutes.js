/**
 * Created by Pradyumn on 29/05/2016.
 */
var controlAccount = require('../controllers/accountLogic');
var passport = require('passport');

module.exports = function(app) {
    //  List all accounts
    app.route('/accounts').post(controlAccount.create).get(controlAccount.list);
    //  Account by Id, in json format, can be updated
    app.route('/accounts/:accountId')
        .get(controlAccount.read).put(controlAccount.update)
        .delete(controlAccount.delete);
    //  Gets the account, parameter is the req
    app.param('accountId', controlAccount.userByID);

    //  Gets and posts registrations
    app.route('/register')
        .get(controlAccount.renderRegister)
        .post(controlAccount.register);

    //  Gets and posts Logins
    app.route('/login')
        .get(controlAccount.renderLogin)
        .post(passport.authenticate('local', {
            successRedirect: '/',
            failureRedirect: '/login',
            failureFlash: true
        }));

    //  Gets logout
    app.get('/logout', controlAccount.logout);

};