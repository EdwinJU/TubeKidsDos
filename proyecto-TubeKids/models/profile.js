'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProfileSchema = Schema({
	name: String,
    username: String,
    pin: String,
    edad: String,
    user: {type: Schema.ObjectId, ref: 'User'}
});

module.exports = mongoose.model('Profile', ProfileSchema);