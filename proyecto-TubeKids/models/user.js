'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = Schema({
	name: String,
	lastname: String,
	email: String,
    birthdate: String,
    country: String,
    password: String,
    user_type: String,
    isVerificated:Boolean
});

module.exports = mongoose.model('User', UserSchema);