var express = require('express');
var router = express.Router();
var comments = require('../controllers/commentController');

router.get('/', comments.top10);
router.get('/all', comments.all);
router.get('/write', comments.createComment);
router.get('/:permaLink', comments.getComment);

router.post('/write', comments.postComment);

module.exports = router;