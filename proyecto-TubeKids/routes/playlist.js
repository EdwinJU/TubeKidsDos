'use strict'

var express = require('express');
var PlaylistController = require('../controllers/playlist');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');



api.get('/playlist/:id', md_auth.ensureAuth,PlaylistController.getPlaylist);
api.post('/playlistSave', md_auth.ensureAuth,PlaylistController.savePlaylist);
api.put('/updatePlaylist/:id',md_auth.ensureAuth, PlaylistController.updatePlaylist);
api.get('/playlists', md_auth.ensureAuth,PlaylistController.getPlaylists);
api.delete('/deletePlaylist/:id',md_auth.ensureAuth, PlaylistController.deletePlaylist);



module.exports = api;