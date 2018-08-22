'use strict'

var express = require('express');
var UserController = require('../controllers/user');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');

api.post('/register', UserController.saveUser);
api.post('/login', UserController.loginUser);
api.put('/update-user/:id',md_auth.ensureAuth, UserController.updateUser);
api.get('/users', md_auth.ensureAuth,UserController.getUsers);
api.delete('/user/:id',md_auth.ensureAuth, UserController.deleteUser);
api.put('/confirmationEmail/:id', UserController.userVerificated);



module.exports = api;