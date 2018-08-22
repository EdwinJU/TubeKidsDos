'use strict'

var mongoose=require('mongoose');
var app = require('./app');
var port = process.env.PORT || 3977;

mongoose.connect('mongodb://localhost:27017/proyecto_tubekids', (err, res) => {
	if (err) {
		throw err;
	}else{
		console.log("La base de datos esta corriendo correctamente");

		app.listen(port,function(){
			console.log("Servidor del api rest de tubekids escuchando en http://localhost:"+port)
		})
	}
});