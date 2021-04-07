"use strict";

var path = require("path");
var fs = require("fs");
var mongoosePaginate = require("mongoose-pagination");
var Artist = require("../models/artist");
var Album = require("../models/album");
var Song = require("../models/song");
// var Song = require("../models/song");
const CodigoAlbum = require("../models/codigoAlbum");
const codigo = require("../models/codigoAlbum");

function getCodigo(req, res) {
  var codigoId = req.params.id;
  CodigoAlbum.findById(codigoId)
    .populate({ path: "codigoAlbum" })
    .exec((err, codigoAlbum) => {
      if (err) {
        res.status(500).send({ mesagge: "Error en la peticionnnnn" });
      } else {
        if (!codigoAlbum) {
          res.status(404).send({ mesagge: "El COdigo Qr no existe" });
        } else {
          res.status(200).send({ codigoAlbum });
        }
      }
    });
}

function getCodigos(req, res) {
  var albumId = req.params.album;

  if (!albumId) {
    var find = CodigoAlbum.find({}).sort("name");
  } else {
    var find = CodigoAlbum.find({ album: albumId }).sort("name");
  }
  find
    .populate({
      path: "album",
      populate: {
        path: "artist",
        model: "Artist",
      },
    })
    .exec(function (err, codigos) {
      if (err) {
        res.status(500).send({ message: "Error en la peticion" });
      } else {
        if (!codigos) {
          res.status(404).send({ message: "No hay codigos" });
        } else {
          res.status(200).send({ codigos });
        }
      }
    });
}

function saveCodigo(req, res) {
  var codigoAlbum = new CodigoAlbum();
  var params = req.body;
  codigoAlbum.name = params.name;
  codigoAlbum.image = "null";
  codigoAlbum.album = params.album;

  codigoAlbum.save((err, codigoAlbumStored) => {
    if (err) {
      res.status(500).send({ mesagge: "Error en la peticion" });
    } else {
      if (!codigoAlbumStored) {
        res.status(404).send({ mesagge: "No se ha guardado el codigo" });
      } else {
        res.status(200).send({ codigoAlbum: codigoAlbumStored });
      }
    }
  });
}

function updateCodigo(req, res) {
  var codigoId = req.params.id;
  var update = req.body;

  CodigoAlbum.findByIdAndUpdate(codigoId, update, (err, codigoAlbumUpdated) => {
    if (err) {
      res.status(500).send({ mesagge: "Error en el servidor" });
    } else {
      if (!codigoAlbumUpdated) {
        res.status(404).send({ mesagge: "No se ha actualizado el codigo" });
      } else {
        res.status(200).send({ codigoAlbum: codigoAlbumUpdated });
      }
    }
  });
}

function deleteCodigo(req, res) {
  var codigoAlbumId = req.params.id;
  CodigoAlbum.findByIdAndRemove(codigoAlbumId, (err, codigoAlbumRemoved) => {
    if (err) {
      res.status(500).send({ message: "Error en el servidor" });
    } else {
      if (!codigoAlbumRemoved) {
        res.status(404).send({ message: "No se ha borrado el codigo" });
      } else {
        res.status(200).send({ codigoAlbum: codigoAlbumRemoved });
      }
    }
  });
}

function uploadImage(req, res) {
  var codigoAlbumId = req.params.id;
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
      file_ext == "jpeg" ||
      file_ext == "GIF" ||
      file_ext == "gif"
    ) {
      CodigoAlbum.findByIdAndUpdate(
        codigoAlbumId,
        { image: file_name },
        (err, codigoAlbumUpdated) => {
          if (!codigoAlbumUpdated) {
            res.status(404).send({
              message: "No se ha podido actualizar la imagen del codigo",
            });
          } else {
            res.status(200).send({ codigoAlbum: codigoAlbumUpdated });
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
  var path_file = "./uploads/codigoAlbum/" + imageFile;
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
  getCodigo,
  saveCodigo,
  updateCodigo,
  deleteCodigo,
  uploadImage,
  getImageFile,
  getCodigos,
};
