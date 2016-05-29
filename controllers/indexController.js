module.exports.background = function(req, res){
    res.render('background', {title: "Stash EvilCorp's Cash - Background"});
};

module.exports.references = function(req, res){
    res.render('references', {title: "Stash EvilCorp's Cash - References"});
};

module.exports.rules = function(req, res){
    res.render('rules', {title: "Stash EvilCorp's Cash - Controls and Scoring"});
};

module.exports.game = function(req, res){
    res.render('game', {title: "Stash EvilCorp's Cash - Stashing Cash"});
};

module.exports.error = function(req, res){
    res.render('error', {title: "Stash EvilCorp's Cash - Can't Stash Here!"});
};

module.exports.bios = function(req, res){
    res.render('bios', {title: "Stash EvilCorp's Cash - Don't Waste Your Time"});
};

module.exports.design = function(req, res){
    res.render('design', {title: "Stash EvilCorp's Cash - Designed by the Challenged"});
};

module.exports.validation = function(req, res){
    res.render('validation', {title: "Stash EvilCorp's Cash - How not to Validate"});    
};
