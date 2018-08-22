'use strict'


var bcrypt = require('bcrypt-nodejs');
var User = require('../models/user');

var jwt = require('../services/jwt');
var nodemailer = require('nodemailer');

var moment = require('moment');


//Crea un usuario
function saveUser(req, res){

	var user = new User();

	var params = req.body;
	var po= req.body.birthdate;

    console.log(params);

	user.name = params.name;
	user.lastname = params.lastname;
	user.email = params.email;
    user.birthdate = params.birthdate;
	user.country = params.country;
	user.user_type="ROLE_ADMIN";

	console.log(po);


	if (params.password) {
		//encriptar contraseña y guardar datos
		bcrypt.hash(params.password, null, null, function(err, hash){
			user.password = hash;

			var m = moment(po, "MM-DD-YYYY");
    		var edad = m.fromNow().split(" ")[0];
    
    		if(edad<18){
				
				res.status(500).send({message: 'Debes ser mayor de edad para registrarte'});

        	return false
       
    		}else{

			if (user.name != null && user.lastname != null && user.email != null) {

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
		}
		});

	}else{
		res.status(200).send({message: 'Introduce una contraseña'});
	}

}

//Metodo que resive los parametros necesarios para loguearse
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
 //Actualiza un usuario de acuerdo a su id


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
//Verifica la cuenta de acuerdo a su id

function userVerificated(req, res){
	var userId = req.params.id;
	req.body.isVerificated = true;
	var update = req.body;

	User.findByIdAndUpdate(userId, update, (err, userUpdated) => {
		if(err){
			 res.status(500).send({message: 'Error al verificar el usuario'});
		}else{
			if (!userUpdated) {
				res.status(404).send({message: 'No se ha podido actualizar el usuario'});
			}else{
				res.status(200).send({user: userUpdated});
			}
		}
	})

}

//Obtiene todos los usuarios 
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
//Elimina un usuario de acuerdo a su id

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



module.exports = {
	saveUser,
	loginUser,
	updateUser,
	getUsers,
	deleteUser,
	userVerificated

};