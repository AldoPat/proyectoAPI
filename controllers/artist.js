"use strict";

var path = require("path");
var fs = require("fs");
var mongoosePaginate = require("mongoose-pagination");
var Artist = require("../models/artist");
var Album = require("../models/album");
var Song = require("../models/song");
const artist = require("../models/artist");

function getArtist(req, res) {
  var artistId = req.params.id;
  Artist.findById(artistId, (err, artist) => {
    if (err) {
      res.status(200).send({ mesagge: "Error en la peticion" });
    } else {
      if (!artist) {
        res.status(404).send({ mesagge: "El artista no existe" });
      } else {
        res.status(200).send({ artist });
      }
    }
  });
}

function saveArtist(req, res) {
  var artist = new Artist();

  var params = req.body;
  artist.name = params.name;
  artist.description = params.description;
  artist.image = "null";

  artist.save((err, artistStored) => {
    if (err) {
      res.status(500).send({ mesagge: "Error al guardar el artista" });
    } else {
      if (!artistStored) {
        res.status(404).send({ mesagge: "El artista no ha sido guardado" });
      } else {
        res.status(200).send({ artist: artistStored });
      }
    }
  });
}

function getArtists(req, res) {
  if (req.params.page) {
    var page = req.params.page;
  } else {
    var page = 1;
  }
  var itemsPerPag = 100;

  Artist.find()
    .sort("name")
    .paginate(page, itemsPerPag, function (err, artists, total) {
      if (err) {
        res.status(500).send({ mesagge: "Error en la peticion" });
      } else {
        if (!artists) {
          res.status(404).send({ mesagge: "No hya artistas" });
        } else {
          return res.status(200).send({
            total_items: total,
            artists: artists,
          });
        }
      }
    });
}

function updateArtist(req, res) {
  var artistId = req.params.id;
  var update = req.body;

  Artist.findByIdAndUpdate(artistId, update, (err, artistUpdated) => {
    if (err) {
      res.status(500).send({ mesagge: "Error al guardar el artista" });
    } else {
      if (!artistUpdated) {
        res.status(404).send({ mesagge: "El artista no ha sido actualizado" });
      } else {
        res.status(200).send({ artist: artistUpdated });
      }
    }
  });
}
function deleteArtist(req, res) {
  var artistId = req.params.id;
  Artist.findByIdAndDelete(artistId, (err, artistRemoved) => {
    if (err) {
      res.status(500).send({ mesagge: "Error al eliminar el artista" });
    } else {
      if (!artistRemoved) {
        res.status(404).send({ mesagge: "El artista no ha eliminado" });
      } else {
        // res.status(404).send({ artistRemoved });

        Album.find({ artist: artistRemoved._id }).deleteOne(
          (err, albumRemoved) => {
            /* Primer copiado*/
            if (err) {
              res.status(500).send({ mesagge: "Error al eliminar el album" });
            } else {
              if (!albumRemoved) {
                res.status(404).send({ mesagge: "El album no ha eliminado" });
              } else {
                /*Segundo copiado cancion */
                Song.find({ album: albumRemoved._id }).deleteOne(
                  (err, songRemoved) => {
                    if (err) {
                      res
                        .status(500)
                        .send({ mesagge: "Error al eliminar la cancion" });
                    } else {
                      if (!songRemoved) {
                        res
                          .status(404)
                          .send({ mesagge: "La cancion no ha sido eliminada" });
                      } else {
                        res.status(200).send({ artist: artistRemoved });
                      }
                    }
                  }
                );
              }
            }
            /*Termina Primer */
          }
        );
      }
    }
  });
}

function uploadImage(req, res) {
  var artistId = req.params.id;
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
      Artist.findByIdAndUpdate(
        artistId,
        { image: file_name },
        (err, artistUpdated) => {
          if (!artistUpdated) {
            res
              .status(404)
              .send({ message: "No se ha podido actualizar el usuario" });
          } else {
            res.status(200).send({ artist: artistUpdated });
          }
        }
      );
    } else {
      res.status(200).send({ message: "Entension del archivo no valido" });
    }

    // console.log(ext_split);
  } else {
    res.status(200).send({ message: "No se ha subido ninguna imagen" });
  }
}

function getImageFile(req, res) {
  var imageFile = req.params.imageFile;
  var path_file = "./uploads/artist/" + imageFile;
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
  getArtist,
  saveArtist,
  getArtists,
  updateArtist,
  deleteArtist,
  uploadImage,
  getImageFile,
};
