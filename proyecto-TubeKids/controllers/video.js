'use strict'

var path = require('path');
var fs = require('file-system');

var Video = require('../models/video');

//Obtiene un video de acuerdo a su id
function getVideo(req, res){
 
    var videoId = req.params.id;
    
    Video.findById(videoId).populate({path: 'playlist'}).exec((err, video)=>{
    
        if(err){
           res.status(500).send({message: 'Error en la peticion'});
    
       }else{
           if(!video){
                res.status(404).send({message: 'El video no existe'});
               
    
            }else{
                res.status(200).send({video});
    
            }
    
        }
    });
    }
    //Obtiene todos los videos 

    function getVideos(req, res){
    
        Video.find(function(err,videos){
            
            if(err){
                res.status(500).send({message: 'Error en la peticion'});
        
        
            }else{
            res.status(200);
            res.json(videos);
            }
        });
    
    }
    //Crea un nuevo video con todos los parametros
    function saveVideo(req, res){
        var video = new Video();
    
        var params = req.body;
        video.name = params.name;
        video.IsFromYoutube = params.IsFromYoutube;
        video.url_youtube = params.url_youtube;
        video.file = null;
        video.playlist = params.playlist;
        video.user = params.user;
        

        if (video.name != null && video.IsFromYoutube != null) {
    
        video.save((err, videoStored) => {
    
            if(err){
                res.status(500).send({message: 'error en el servidor'});
    
            }else{
                if(!videoStored){
                    res.status(404).send({message: 'no se ha guardado el video'});
    
    
                }else{
                    res.status(200).send({video: videoStored});
    
                }
            }
    
        });
    }else{

        res.status(200).send({message: 'Introduce todos los campos'});
    }
    }
    //Actualiza un video de acuerdo a su id

    function updateVideo(req, res){
        var videoId = req.params.id;
        var update = req.body;
    
        Video.findByIdAndUpdate(videoId, update, (err, videoUpdated) => {
            if(err){
                 res.status(500).send({message: 'Error al actualizar el video'});
            }else{
                if (!videoUpdated) {
                    res.status(404).send({message: 'No se ha podido actualizar el video'});
                }else{
                    res.status(200).send({video: videoUpdated});
                }
            }
        })
    
    }
    //Elimina un video de acuerdo a su id

    
    function deleteVideo(req, res){
        var videoId = req.params.id;
    
        Video.findByIdAndRemove(videoId, (err, videoRemoved) => {
            if(err){
                res.status(500).send({message: 'Error'});
    
    
            }else{
                if(!videoRemoved){
                    res.status(404).send({message: 'el video no ha sido eliminado'});
    
    
                }else{
                    res.status(404).send({videoRemoved});
    
                }
            }
        })
    
    }
//Actualiza el video para agregarle un archivo local
    function uploadFile(req, res){
	var videoId = req.params.id;
	var file_name = 'No subido';

	if (req.files) {
		
        var file_path = req.files.file.path; //fichero el cual va a subir
        var file_split = file_path.split('\/'); //recortar para obtener el nombre de la imagen
        var file_name = file_split[2]; //se recoje el campo 3 del arreglo, porque ahi se encuentra el nombre de la imagen

        var ext_split = file_name.split('\.'); //se recorta para obtner la extencion del archivo
        var file_ext = ext_split[1]; //se recoje el campo 2. porque ahi esta la extencion despues del split

		if (file_ext == 'mp4' || file_ext == 'avi' || file_ext == 'm4v') {

            
        Video.findByIdAndUpdate(videoId, {file: file_name}, (err, videoUpdated)=>{
   			if (!videoUpdated) {
				res.status(404).send({message: 'No se ha podido actualizar el video'});
    		}else{
				res.status(200).send({video: videoUpdated});
			}
				
			});

		}else{
           res.status(200).send({message: 'Extension del archivo no valida'});
           
		}

	}else{
		res.status(200).send({message: 'No has subido ningun video '});
	}

}



function updateVideo(req, res){
    var videoId = req.params.id;
    var update = req.body;

    Video.findByIdAndUpdate(videoId, update, (err, videoUpdated) => {
        if(err){
             res.status(500).send({message: 'Error al actualizar el video'});
        }else{
            if (!videoUpdated) {
                res.status(404).send({message: 'No se ha podido actualizar el video'});
            }else{
                res.status(200).send({video: videoUpdated});
            }
        }
    })

}

//Obtiene el video 

function getVideoFile(req, res){
 
 var videoFile = req.params.videoFile;
 var path_file = './uploads/videos/'+videoFile;
 
 fs.access(path_file, fs.constants.F_OK, (err) => {
 if(!err){
   res.sendFile(path.resolve(path_file));
 }else{
   res.status(200).send({ message: 'No existe el video' });
 }
 
 }); 
}

    
    
    
    module.exports={
        getVideo,
        saveVideo,
        getVideos,
        updateVideo,
        deleteVideo,
        uploadFile,
        getVideoFile
        
    };