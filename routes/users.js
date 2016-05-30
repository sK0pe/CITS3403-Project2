var express = require('express');
var router = express.Router();
var users = require('../controllers/userController');

//  Get pages
router.get('/register', users.getRegistration);
router.get('/login', users.getLogin);
router.get('/logout', users.getLogout);

//  Post pages
router.post('/register', users.postRegistration);
router.post('/login', users.postLogin);

module.exports = router;
