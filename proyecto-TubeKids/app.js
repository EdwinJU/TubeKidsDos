'use strict'

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

//cargar rutas
var user_routes = require('./routes/user');
var profile_routes = require('./routes/profile');
var playlist_routes = require('./routes/playlist');
var video_routes = require('./routes/video');


app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
);
if(req.method === 'OPTIONS'){
    res.header('Access-Control-Allow.Methods', 'PUT, POST, PATCH, DELETE, GET');
    return res.status(200).json({});

}
next();

})

// configurar cabeceras http

// ruta base
app.use('/api', user_routes);
app.use('/api', playlist_routes);
app.use('/api', video_routes);
app.use('/api', profile_routes);





module.exports = app;