
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var comment = mongoose.model('comment');

router.get('/', function(req, res){
	comment.find(function(err, comments){
		console.log(comments)
		res.render(
			'comments',
			{comments: comments}
		);
	})
});

router.post('/', function(req, res){
	// console.log(req.body.comment);
	// res.redirect('form')
	new Comment({comment: req.body.comment})
	.save(function(err, comment){
		console.log(comment)
		res.redirect('comments');
	})
});

module.exports = router;
