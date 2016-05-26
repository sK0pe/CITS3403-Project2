var express = require('express');
var router = express.Router();
var controlGetPage = require('../controllers/routeLogic');

//  Get Pages / Views
router.get('/', controlGetPage.background);
router.get('/background', controlGetPage.background);
router.get('/references', controlGetPage.references);
router.get('/rules', controlGetPage.rules);
router.get('/game', controlGetPage.game);
router.get('/login', controlGetPage.login);


module.exports = router;
