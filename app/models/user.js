'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt   = require('bcrypt-nodejs');

var User = new Schema({
	local: {
        email : String,
        password : String,
    },
	github: {
		id: String,
		displayName: String,
		username: String,
    publicRepos: Number
	},
	shared: {
		name: String,
		country: String,
    state: String,
    city: String
	}
});

// methods ======================
// generating a hash
User.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
User.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};


module.exports = mongoose.model('User', User);
