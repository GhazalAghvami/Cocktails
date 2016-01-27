var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Recipe = mongoose.model('Recipe');
var jwt = require('express-jwt');
var auth = jwt({
  userProperty: "payload", //req.payload._id in the Route
secret: process.env.SECRET  //matches the secret in model
   });

router.post('/:comID', auth, function(req, res, next) {
  var recipe = new Recipe(req.body);
  recipe.createdBy = req.payload._id;
  recipe.created = new Date();
  recipe.community = req.params.comID;
  recipe.save(function(err, result) {
    if(err) return next(err);
    if(!result) return next("Could not Create");
    res.send(result);
  });
});



router.delete('/:id', auth, function(req, res, next) {
  Recipe.remove({_id: req.params.id}, function(err, result) {
      if(err) return next(err);
      console.log(result);
      res.send();
  });
});

router.get('/:id', function(req, res, next){
  Recipe.find({community: req.params.id}, function(err, result){
    if(err) {return next(err);}
    if(!result) {return next({err: "Error finding recipe by community ID."});}
    res.send(result);
  });
});

router.get('/edit/:id', function(req, res, next){
  Recipe.findOne({_id: req.params.id}, function(err, result){
    if(err) {return next(err);}
    if(!result) {return next({err: "Error finding recipe by recipe ID."});}
    res.send(result);
  });
});

router.put('/', auth, function (req, res, next) {
  //Mongoose/Mongo method '.update' takes an object for the search as the first param
  //The second param is an object which is the info to update with
  // req.body.recipeEditted.id = req.body.recipeEditted._id;
  Recipe.update({_id: req.body.recipeEditted._id}, req.body.recipeEditted, function (err, result) {
    //Checks for both error cases: server error and no post found
    if(err) return next(err);
    if(!result) return next({err: "The post wasn't found for updating"});
    res.send(result);
  });
});

module.exports = router;
