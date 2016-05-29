var express = require('express');
var router = express.Router();
var comments = require('../controllers/commentController');

router.get('/', comments.top10);
router.get('/create', comments.createComment);
router.get('/:permaLink', comments.getComment);
router.post('/create', comments.postComment);

module.exports = router;