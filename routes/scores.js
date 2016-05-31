var express = require('express');
var router = express.Router();
var scores = require('../controllers/scoreController');

router.get('/', scores.top10);
router.get('/all', scores.all);
router.post('/postScore', scores.postScore);

module.exports = router;