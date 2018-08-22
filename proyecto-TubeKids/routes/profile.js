'use strict'

var express = require('express');
var ProfileController = require('../controllers/profile');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');


api.post('/register-profile',md_auth.ensureAuth, ProfileController.saveProfile);
api.post('/login-profile', md_auth.ensureAuth, ProfileController.loginProfile);
api.put('/update-profile/:id', md_auth.ensureAuth, ProfileController.updateProfile);
api.get('/profiles', md_auth.ensureAuth, ProfileController.getProfiles);
api.delete('/delete-profile/:id', md_auth.ensureAuth, ProfileController.deleteProfile);





module.exports = api;