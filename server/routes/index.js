var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('background', { 
      title: "Stash EvilCorp's Cash"
  });
});

router.get('/background', function(req, res){
    res.render('background', {
        title: "Stash EvilCorp's Cash - Background"        
    });
});

router.get('/references', function(req, res){
    res.render('references', {
        title: "Stash EvilCorp's Cash - References"
    });
});

router.get('/rules', function(req, res){
    res.render('rules', {
        title: "Stash EvilCorp's Cash - Controls and Scoring"
    });
});

router.get('/game', function(req, res){
    res.render('game', {
        title: "Stash EvilCorp's Cash - Stashing Cash"
    });
});

module.exports = router;
