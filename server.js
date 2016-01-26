var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var app = express();
var port = process.env.PORT || 3000;
var passport = require("passport");
var mongoose = require('mongoose');
require('./models/RecipeModel');
require('./models/CommunityModel');
require('./models/User');
require('./config/passport');

mongoose.connect("mongodb://localhost/Cocktail");

app.set('views', path.join(__dirname, 'views'));
//set the view engine that will render HTML from the server to the client
app.engine('.html', require('ejs').renderFile);
//Allow for these directories to be usable on the client side
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/dist'));
app.use(express.static(__dirname + '/bower_components'));
//we want to render html files
app.set('view engine', 'html');
app.set('view options', {
	layout: false
});
passport.initialize();
//middleware that allows for us to parse JSON and UTF-8 from the body of an HTTP request
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Route Links
var recipeRoutes = require('./routes/RecipeRoutes');
var communityRoutes = require('./routes/CommunityRoutes');
var userRoutes = require('./routes/UserRoutes');

//on homepage load, render the index page
app.get('/', function(req, res) {
	res.render('index');
});

// API
app.use('/api/recipe', recipeRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/users', userRoutes);

var server = app.listen(port, function() {
	var host = server.address().address;
	console.log('Example app listening at http://localhost:' + port);
});
