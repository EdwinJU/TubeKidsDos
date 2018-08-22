'use strict'

//var fs = require('file-system');
//var path = require('path');
var bcrypt = require('bcrypt-nodejs');
var User = require('../models/user');

var jwt = require('../services/jwt');
var nodemailer = require('nodemailer');

var mongoseePaginate = require('mongoose-pagination');


function pruebas(req, res){
	res.status(200).send({
		message: 'Probando una accion del controlador de usuarios del api rest con node y mongo'
	});
}

function saveUser(req, res){

	var user = new User();

	var params = req.body;

    console.log(params);

	user.name = params.name;
	user.lastname = params.lastname;
	user.email = params.email;
    user.birthdate = params.birthdate;
	user.country = params.country;
	user.user_type="ROLE_ADMIN";
	if (params.password) {
		//encriptar contraseña y guardar datos
		bcrypt.hash(params.password, null, null, function(err, hash){
			user.password = hash;
			if (user.name != null && user.lastname != null && user.email != null) {

					 //var hoy= new Date();
					 //var edad=hoy.getFullYear() - user.birthdate.;

					 //if(edad){

					 //}				

				//guarde usuario
     			user.save((err, userStored) => {
					if (err) {

						res.status(500).send({message: 'Error al guardar el usuario'});
					}else{

						if (!userStored) {

							res.status(404).send({message: 'No se ha registrado el usuario'});
						}else{

							res.status(200).send({user: userStored});	

							var transporter = nodemailer.createTransport({
								service: 'Gmail',
								auth:{
									user: 'edwinjimenezurbina@gmail.com',
									pass: 'DarkSnow12'

								}
							});
							//definir el email
							var mailOptions = {
								from: 'Remitente',
								to: user.email,
								subject:'Confirmacion de registro TubeKids',
								text:'Se le agradece su registro en la plataforma, ingrese al link localhost:3977/api/confirmationEmail/'+user.id
							};
							//Enviar email
							transporter.sendMail(mailOptions, function(error, info){
								if (error){
									console.log(error);
									res.send(500, err.message);
								} else {
									console.log("Email sent");
									res.status(200).jsonp(req.body);
								}
							});

						}

					}
				});
			}else{

				res.status(200).send({message: 'Introduce todos los campos'});
			}
		});

	}else{
		res.status(200).send({message: 'Introduce una contraseña'});
	}

}

function loginUser(req, res){
	
	var params =req.body;

	var email = params.email;
	var password = params.password;

	if (email != null && password != null) {

	User.findOne({email: email.toLowerCase()}, (err, user) => {
		
		if (err) {
			res.status(500).send({message: 'Error en la peticion'});
		}else{

			if (!user) {
				res.status(404).send({message: 'El usuario no existe'});
			}else{
				//comprobar contarseña
				bcrypt.compare(password, user.password, function(err, check){
					if (check) {
						//devolver los datos del usuario logueado
						if (params.gethash) {
							//devolver un token jwt
							res.status(200).send({
								token: jwt.createToken(user)
							});
						}else{
							res.status(200).send({user});
						}
					}else{
						res.status(404).send({message: 'La contraseña es incorrecta'});
					}
				});	
			}

		}
		});
	}else{
		res.status(200).send({message: 'Introduce todos los campos'});

	}
 }

function updateUser(req, res){
	var userId = req.params.id;
	var update = req.body;

	User.findByIdAndUpdate(userId, update, (err, userUpdated) => {
		if(err){
			 res.status(500).send({message: 'Error al actualizar el usuario'});
		}else{
			if (!userUpdated) {
				res.status(404).send({message: 'No se ha podido actualizar el usuario'});
			}else{
				res.status(200).send({user: userUpdated});
			}
		}
	})

}
function userVerificated(req, res){
	var userId = req.params.id;
	req.body.isVerificated = true;
	var update = req.body;

	User.findByIdAndUpdate(userId, update, (err, userUpdated) => {
		if(err){
			 res.status(500).send({message: 'Error al actualizar el usuario'});
		}else{
			if (!userUpdated) {
				res.status(404).send({message: 'No se ha podido actualizar el usuario'});
			}else{
				res.status(200).send({user: userUpdated});
			}
		}
	})

}

function getUsers(req, res){

	User.find(function(err,users){
		
		if(err){
			res.status(500).send({message: 'Error en la peticion'});
	
	
		}else{
        res.status(200);
		res.json(users);
		}
    });

}

function deleteUser(req, res){
	var userId = req.params.id;

	User.findByIdAndRemove(userId, (err, userRemoved) => {
		if(err){
			res.status(500).send({message: 'Error'});


		}else{
			if(!userRemoved){
				res.status(404).send({message: 'El usuario no ha sido eliminado'});


			}else{
				res.status(404).send({userRemoved});

			}
		}
	})

}

//function uploadImage(req, res){
//	var userId = req.params.id;
//	var file_name = 'No subido';

//	if (req.files) {
//		var file_path = req.files.image.path;
//		var file_split = file_path.split('\\');
//		var file_name = file_split[2];

//		var ext_split = file_name.split('\.');
//		var file_ext = ext_split[1];

//		if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif') {

//			User.findByIdAndUpdate(userId, {image: file_name}, (err, userUpdated)=>{
//				if (!userUpdated) {
//				res.status(404).send({message: 'No se ha podido actualizar el usuario'});
//			}else{
//				res.status(200).send({user: userUpdated});
//			}
				
//			});

//		}else{
//		   res.status(200).send({message: 'Extension del archivo no valida'});

//		}

//	}else{
//		res.status(200).send({message: 'No has subido ninguna imagen '});
//	}

//}
//NOOOOOOOOO FUNCIONAAAAAAA
//function getImageFile(req, res){
//	var imageFile = req.params.imageFile;
//	var path_file ='./uploads/users'+imageFile;

//	fs.exists(path_file, function(exists){
//		if (exists){
//			res.sendFile(path.resolve(path_file));
//		}else{
//			res.status(200).send({message: 'No existe la imagen'});

//		}
//	});	
//}

//function getImageFile(req, res){
 
 //var imageFile = req.params.imageFile;
 //var path_file = './uploads/users/'+imageFile;
 
 //fs.access(path_file, fs.constants.F_OK, (err) => {
 //if(!err){
   //res.sendFile(path.resolve(path_file));
 //}else{
  // res.status(200).send({ message: 'No existe la imagen' });
 //}
 
 //}); 
//}


module.exports = {
	pruebas,
	saveUser,
	loginUser,
	updateUser,
	getUsers,
	deleteUser,
	userVerificated
//	uploadImage,
//	getImageFile
};