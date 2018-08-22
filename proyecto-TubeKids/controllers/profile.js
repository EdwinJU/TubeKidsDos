'use strict'

var bcrypt = require('bcrypt-nodejs');
var Profile = require('../models/profile');

// Crea una playlist
function saveProfile(req, res){

	var profile = new Profile();

	var params = req.body;

    console.log(params);

	profile.name = params.name;
	profile.username = params.username;
    profile.edad = params.edad;
    profile.user = params.user;
	if (params.pin) {
		//encriptar contraseña y guardar datos
		bcrypt.hash(params.pin, null, null, function(err, hash){
			profile.pin = hash;
			if (profile.name != null && profile.username != null && profile.edad != null) {		

				//guarde usuario
     			profile.save((err, profileStored) => {
					if (err) {

						res.status(500).send({message: 'Error al guardar el perfil'});
					}else{

						if (!profileStored) {

							res.status(404).send({message: 'No se ha registrado el perfil'});
						}else{

							res.status(200).send({profile: profileStored});	

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
//Metodo para loguear

function loginProfile(req, res){
	
	var params =req.body;

	var username = params.username;
	var pin = params.pin;

	if (username != null && pin != null) {

	Profile.findOne({username: username.toLowerCase()}, (err, profile) => {
		
		if (err) {
			res.status(500).send({message: 'Error en la peticion'});
		}else{

			if (!profile) {
				res.status(404).send({message: 'El perfil no existe'});
			}else{
				//comprobar contarseña
				bcrypt.compare(pin, profile.pin, function(err, check){
					if (check) {
						
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
 //Actualiza una perfil de acuerdo a su id


function updateProfile(req, res){
	var profileId = req.params.id;
	var update = req.body;

	Profile.findByIdAndUpdate(profileId, update, (err, profileUpdated) => {
		if(err){
			 res.status(500).send({message: 'Error al actualizar el perfil'});
		}else{
			if (!userUpdated) {
				res.status(404).send({message: 'No se ha podido actualizar el perfil'});
			}else{
				res.status(200).send({profile: profileUpdated});
			}
		}
	})

}

//Obtiene todos los perfiles

function getProfiles(req, res){

	Profile.find(function(err,profiles){
		
		if(err){
			res.status(500).send({message: 'Error en la peticion'});
	
	
		}else{
        res.status(200);
		res.json(profiles);
		}
    });

}
//Obtiene un perfil de acuerdo a su id


function getProfile(req, res){
 
    var profileId = req.params.id;
    
    Profile.findById(profileId).populate({path: 'user'}).exec((err, profile)=>{
    
        if(err){
           res.status(500).send({message: 'Error en la peticion'});
    
       }else{
           if(!profile){
                res.status(404).send({message: 'El perfil no existe'});
               
    
            }else{
                res.status(200).send({profile});
    
            }
    
        }
    });
	}
	
//Elimina un perfil de acuerdo a su id


function deleteProfile(req, res){
	var profileId = req.params.id;

	Profile.findByIdAndRemove(profileId, (err, profileRemoved) => {
		if(err){
			res.status(500).send({message: 'Error'});


		}else{
			if(!profileRemoved){
				res.status(404).send({message: 'El perfil no ha sido eliminado'});


			}else{
				res.status(404).send({profileRemoved});

			}
		}
	})

}

module.exports = {
	saveProfile,
	loginProfile,
	updateProfile,
	getProfiles,
	deleteProfile,
	getProfile
};