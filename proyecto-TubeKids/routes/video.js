'use strict'

var express = require('express');
var VideoController = require('../controllers/video');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: './uploads/videos'});



api.get('/video/:id', md_auth.ensureAuth, VideoController.getVideo);
api.post('/saveVideo', md_auth.ensureAuth,VideoController.saveVideo);
api.put('/updateVideo/:id',md_auth.ensureAuth, VideoController.updateVideo);
api.get('/videos', md_auth.ensureAuth,VideoController.getVideos);
api.delete('/deleteVideo/:id',md_auth.ensureAuth, VideoController.deleteVideo);


api.post('/upload-file-video/:id', [md_auth.ensureAuth, md_upload],VideoController.uploadFile);
api.get('/get-video-file', VideoController.getVideoFile);



module.exports = api;