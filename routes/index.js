var express = require('express');
var router = express.Router();
var indices = require('../controllers/indexController');
var comments = require('../controllers/commentController');

//  Get Pages / Views
//router.get('/', comments.top10);
router.get('/', comments.top10);
router.get('/background', indices.background);
router.get('/references', indices.references);
router.get('/rules', indices.rules);
router.get('/game', indices.game);
router.get('/bios', indices.bios);
router.get('/design', indices.design);
router.get('/validation', indices.validation);

module.exports = router;
