var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Community = mongoose.model('Community');
var Recipe = mongoose.model('Recipe');

var passport = require('passport');

router.post('/register', function(req, res, next) {
  var user = new User(req.body);
  user.setPassword(req.body.password);
  user.save(function(err, result) {
    if(err) return next(err);
  res.send(result.createToken());
  });
});

router.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user) {
    if(err) return next(err);
    res.send(user.createToken());
  })(req, res, next);
});

router.get('/profile/:id', function(req, res, next){
  var sendBack ={};
  Community.find({createdBy:req.params.id})
  .exec(function(err, result){
    if(err) return next(err);
    if(!result) return next('Could not find request');
    sendBack.communities = result;

  Recipe.find({createdBy:req.params.id})
  .exec(function(err, result){
    if(err) return next(err);
    if(!result) return next('Could not find request');
    sendBack.recipes = result;
    res.send(sendBack);
  });
});

});

module.exports = router;
