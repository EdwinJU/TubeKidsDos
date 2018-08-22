'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var VideoSchema = Schema({
    name: String,
	IsFromYoutube: Boolean,
	url_youtube: String,
    file: String,
    playlist: {type: Schema.ObjectId, ref: 'Playlist'},
    user: {type: Schema.ObjectId, ref: 'User'}

});

module.exports = mongoose.model('Video', VideoSchema);