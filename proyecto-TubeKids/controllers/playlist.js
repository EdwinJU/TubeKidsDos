'use strict'

var path = require('path');
var fs = require('fs');

var Playlist = require('../models/playlist');

//Obtiene una playlist de acuerdo a su id
function getPlaylist(req, res){
 
var playlistId = req.params.id;

Playlist.findById(playlistId).populate({path: 'user'}).exec((err, playlist)=>{

    if(err){
        res.status(500).send({message: 'Error en la peticion'});

    }else{
        if(!playlist){
            res.status(404).send({message: 'La playlist no exist6e'});
           

        }else{
            res.status(200).send({playlist});

        }

    }
});
}
//Obtiene todas las playlist
function getPlaylists(req, res){

	Playlist.find(function(err,playlists){
		
		if(err){
			res.status(500).send({message: 'Error en la peticion'});
	
	
		}else{
        res.status(200);
		res.json(playlists);
		}
    });

}
//Guarda una playlist
function savePlaylist(req, res){
    var playlist = new Playlist();

    var params = req.body;
    playlist.name = params.name;
    playlist.description = params.description;
    playlist.user = params.user;

    playlist.save((err, playlistStored) => {

        if(err){
            res.status(500).send({message: 'error en el servidor'});

        }else{
            if(!playlistStored){
                res.status(404).send({message: 'no se ha guardado la playlist'});


            }else{
                res.status(200).send({playlist: playlistStored});

            }
        }

    });
}

//Actualiza una playlist de acuerdo a su id
function updatePlaylist(req, res){
	var playlistId = req.params.id;
	var update = req.body;

	Playlist.findByIdAndUpdate(playlistId, update, (err, playlistUpdated) => {
		if(err){
			 res.status(500).send({message: 'Error al actualizar la playlist'});
		}else{
			if (!playlistUpdated) {
				res.status(404).send({message: 'No se ha podido actualizar la playlist'});
			}else{
				res.status(200).send({playlist: playlistUpdated});
			}
		}
	})

}
//Elimina una playlist de acuerdo a su id


function deletePlaylist(req, res){
	var playlistId = req.params.id;

	Playlist.findByIdAndRemove(playlistId, (err, playlistRemoved) => {
		if(err){
			res.status(500).send({message: 'Error'});


		}else{
			if(!playlistRemoved){
				res.status(404).send({message: 'La playlist no ha sido eliminado'});


			}else{
				res.status(404).send({playlistRemoved});

			}
		}
	})

}



module.exports={
    getPlaylist,
    savePlaylist,
    getPlaylists,
    updatePlaylist,
    deletePlaylist
};