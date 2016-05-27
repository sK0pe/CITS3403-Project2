var express = require('express');
var router = express.Router();
var controlGetPage = require('../controllers/routeLogic');
var controlAccount = require('../controllers/accountLogic');

//  Get Pages / Views
router.get('/', controlGetPage.background);
router.get('/background', controlGetPage.background);
router.get('/references', controlGetPage.references);
router.get('/rules', controlGetPage.rules);
router.get('/game', controlGetPage.game);
router.get('/index', controlGetPage.index);

//  Register
router.get('/register', controlAccount.register);
router.post('/register', controlAccount.newPlayer);
//  Login
router.get('/login', controlAccount.login);
router.post('/login', controlAccount.authenticate);
//  Logout
router.get('/logout', controlAccount.logout);


module.exports = router;
