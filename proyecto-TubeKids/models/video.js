'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var VideoSchema = Schema({
    number: String,
    name: String,
	IsFromYoutube: Boolean,
	url_youtube: String,
    file: String,
    playlist: {type: Schema.ObjectId, ref: 'Playlist'},
    playlistGe: {type: Schema.ObjectId, ref: 'Playlist'}

});

module.exports = mongoose.model('Video', VideoSchema);