"use strict";

var path = require("path");
var fs = require("fs");
var mongoosePaginate = require("mongoose-pagination");

var Artist = require("../models/artist");
var Album = require("../models/album");
var Song = require("../models/song");
const album = require("../models/album");

// const artist = require("../models/artist");

function getAlbum(req, res) {
  var albumId = req.params.id;
  Album.findById(albumId)
    .populate({ path: "artist" })
    .exec((err, album) => {
      if (err) {
        res.status(500).send({ mesagge: "Error en la peticion" });
      } else {
        if (!album) {
          res.status(404).send({ mesagge: "El album no existe" });
        } else {
          res.status(200).send({ album });
        }
      }
    });
}
function getAlbums(req, res) {
  var artistId = req.params.artist;

  if (!artistId) {
    var find = Album.find({}).sort("title");
  } else {
    var find = Album.find({ artist: artistId }).sort("year");
  }

  find.populate({ path: "artist" }).exec((err, albums) => {
    if (err) {
      res.status(500).send({ mesagge: "Error en la peticion" });
    } else {
      if (!albums) {
        res.status(404).send({ mesagge: "No hay albums" });
      } else {
        res.status(200).send({ albums });
      }
    }
  });
}

function saveAlbum(req, res) {
  var album = new Album();
  var params = req.body;
  album.title = params.title;
  album.description = params.description;
  album.year = params.year;
  album.image = "null";
  album.artist = params.artist;

  album.save((err, albumStored) => {
    if (err) {
      res.status(500).send({ mesagge: "Error en la peticion" });
    } else {
      if (!albumStored) {
        res.status(404).send({ mesagge: "No se ha guardado el album" });
      } else {
        res.status(200).send({ album: albumStored });
      }
    }
  });
}

function updateAlbum(req, res) {
  var albumId = req.params.id;
  var update = req.body;

  Album.findByIdAndUpdate(albumId, update, (err, albumUpdated) => {
    if (err) {
      res.status(500).send({ mesagge: "Error en el servidor" });
    } else {
      if (!albumUpdated) {
        res.status(404).send({ mesagge: "No se ha actualizado el album" });
      } else {
        res.status(200).send({ album: albumUpdated });
      }
    }
  });
}

function deleteAlbum(req, res) {
  var albumId = req.params.id;

  Album.findByIdAndRemove(albumId, (err, albumRemoved) => {
    /* Primer copiado*/
    if (err) {
      res.status(500).send({ mesagge: "Error al eliminar el album" });
    } else {
      if (!albumRemoved) {
        res.status(404).send({ mesagge: "El album no ha eliminado" });
      } else {
        /*Segundo copiado cancion */
        Song.find({ album: albumRemoved._id }).deleteOne((err, songRemoved) => {
          if (err) {
            res.status(500).send({ mesagge: "Error al eliminar la cancion" });
          } else {
            if (!songRemoved) {
              res
                .status(404)
                .send({ mesagge: "La cancion no ha sido eliminada" });
            } else {
              res.status(200).send({ album: albumRemoved });
            }
          }
        });
        /*Termina sugundo */
      }
    }
    /*Termina Primer */
  });
}

function uploadImage(req, res) {
  var albumId = req.params.id;
  var file_name = "No subido...";

  if (req.files) {
    var file_path = req.files.image.path;
    var file_split = file_path.split("\\");
    var file_name = file_split[2];

    var ext_split = file_name.split(".");
    var file_ext = ext_split[1];

    if (
      file_ext == "JPG" ||
      file_ext == "JPEG" ||
      file_ext == "PNG" ||
      file_ext == "png" ||
      file_ext == "jpg" ||
      file_ext == "jpeg"
    ) {
      Album.findByIdAndUpdate(
        albumId,
        { image: file_name },
        (err, albumUpdated) => {
          if (!albumUpdated) {
            res
              .status(404)
              .send({ message: "No se ha podido actualizar el usuario" });
          } else {
            res.status(200).send({ album: albumUpdated });
          }
        }
      );
    } else {
      res.status(200).send({ message: "Entension del archivo no valido" });
    }

    console.log(ext_split);
  } else {
    res.status(200).send({ message: "No se ha subido ninguna imagen" });
  }
}

function getImageFile(req, res) {
  var imageFile = req.params.imageFile;
  var path_file = "./uploads/album/" + imageFile;
  fs.exists(path_file, function (exists) {
    if (exists) {
      res.sendFile(path.resolve(path_file));
      return;
    } else {
      res.status(200).send({ message: "No existe la imagen" });
    }
  });
}

module.exports = {
  getAlbum,
  saveAlbum,
  getAlbums,
  updateAlbum,
  deleteAlbum,
  uploadImage,
  getImageFile,
};
