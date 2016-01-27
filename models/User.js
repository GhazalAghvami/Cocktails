var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');

var UserSchema = new mongoose.Schema({
username: {required: true, unique: true, type: String, lowercase: true, trim: true},
email: {required: true, unique: true, type:String, lowercase: true, trim: true},
passwordHash: String,
salt: String,
recipes: [{type: mongoose.Schema.Types.ObjectId, ref: 'Recipe'}],
communities: [{type: mongoose.Schema.Types.ObjectId, ref: 'Community'}]

});

UserSchema.methods.setPassword = function(password) {
 this.salt = crypto.randomBytes(16).toString('hex');
    this.passwordHash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
};

UserSchema.methods.checkPassword = function(password) {
 var passwordHash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
 return (passwordHash === this.passwordHash);
};

UserSchema.methods.createToken = function() {
 return jwt.sign({
   _id: this._id,
   username: this.username,

 }, process.env.SECRET); //Add Passcode here
};

mongoose.model('User', UserSchema);
