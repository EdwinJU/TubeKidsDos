'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PlaylistSchema = Schema({
	name: String,
	description: String,
    user: {type: Schema.ObjectId, ref: 'User'}
});

module.exports = mongoose.model('Playlist', PlaylistSchema);