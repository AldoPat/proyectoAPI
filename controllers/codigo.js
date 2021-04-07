"use strict";

var path = require("path");
var fs = require("fs");
var mongoosePaginate = require("mongoose-pagination");
var Artist = require("../models/artist");
var Album = require("../models/album");
var Song = require("../models/song");
// var Song = require("../models/song");
const Codigo = require("../models/codigo");
const codigo = require("../models/codigo");

function getCodigo(req, res) {
  var codigoId = req.params.id;
  Codigo.findById(codigoId)
    .populate({ path: "codigo" })
    .exec((err, codigo) => {
      if (err) {
        res.status(500).send({ mesagge: "Error en la peticionnnnn" });
      } else {
        if (!codigo) {
          res.status(404).send({ mesagge: "El COdigo Qr no existe" });
        } else {
          res.status(200).send({ codigo });
        }
      }
    });
}

function getCodigos(req, res) {
  var songId = req.params.song;

  if (!songId) {
    var find = Codigo.find({}).sort("image");
  } else {
    var find = Codigo.find({ song: songId }).sort("image");
  }
  find
    .populate({
      path: "song",
      populate: {
        path: "album",
        model: "Album",
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
  var codigo = new Codigo();
  var params = req.body;
  codigo.name = params.name;
  codigo.image = "null";
  codigo.song = params.song;

  codigo.save((err, codigoStored) => {
    if (err) {
      res.status(500).send({ mesagge: "Error en la peticion" });
    } else {
      if (!codigoStored) {
        res.status(404).send({ mesagge: "No se ha guardado el codigo" });
      } else {
        res.status(200).send({ codigo: codigoStored });
      }
    }
  });
}

function updateCodigo(req, res) {
  var codigoId = req.params.id;
  var update = req.body;

  Codigo.findByIdAndUpdate(codigoId, update, (err, codigoUpdated) => {
    if (err) {
      res.status(500).send({ mesagge: "Error en el servidor" });
    } else {
      if (!codigoUpdated) {
        res.status(404).send({ mesagge: "No se ha actualizado el codigo" });
      } else {
        res.status(200).send({ codigo: codigoUpdated });
      }
    }
  });
}

function deleteCodigo(req, res) {
  var codigoId = req.params.id;
  Codigo.findByIdAndRemove(codigoId, (err, codigoRemoved) => {
    if (err) {
      res.status(500).send({ message: "Error en el servidor" });
    } else {
      if (!codigoRemoved) {
        res.status(404).send({ message: "No se ha borrado el codigo" });
      } else {
        res.status(200).send({ codigo: codigoRemoved });
      }
    }
  });
}

function uploadImage(req, res) {
  var codigoId = req.params.id;
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
      Codigo.findByIdAndUpdate(
        codigoId,
        { image: file_name },
        (err, codigoUpdated) => {
          if (!codigoUpdated) {
            res.status(404).send({
              message: "No se ha podido actualizar la imagen del codigo",
            });
          } else {
            res.status(200).send({ codigo: codigoUpdated });
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
  var path_file = "./uploads/codigo/" + imageFile;
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
