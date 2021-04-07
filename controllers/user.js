"use strict";

var fs = require("fs");
var path = require("path");
var bcrypt = require("bcrypt-nodejs");
var User = require("../models/user");
const { use } = require("../router/user");
var jwt = require("../services/jwt");

function pruebas(req, res) {
  res.status(200).send({
    message: "Probando el controllador del api rest",
  });
}

function saveUser(req, res) {
  var user = new User();
  var params = req.body;

  console.log(params);

  user.name = params.name;
  user.surname = params.surname;
  user.email = params.email;
  user.role = "ROLE_USER";
  user.image = "null";

  if (params.password) {
    //Encriptar contraseñas y guardar datos
    bcrypt.hash(params.password, null, null, function (err, hash) {
      user.password = hash;

      if (user.name != null && user.surname != null && user.email != null) {
        //Gurarda el usuario
        user.save((err, userStored) => {
          if (err) {
            res.status(500).send({ message: "Error al guardar el usuario" });
          } else {
            if (!userStored) {
              res
                .status(404)
                .send({ message: "No se ha registrado el usuario" });
            } else {
              res.status(200).send({ user: userStored });
            }
          }
        });
      } else {
        res.status(200).send({ message: "Rellena todos campos" });
      }
    });
  } else {
    res.status(200).send({ message: "Introduce la contraseña" });
  }
}

function loginUser(req, res) {
  var params = req.body;

  var email = params.email;
  var password = params.password;

  User.findOne({ email: email.toLowerCase() }, (err, user) => {
    if (err) {
      res.status(500).send({ message: "Error en la peticion" });
    } else {
      if (!user) {
        res.status(404).send({ message: "El usuario no existe" });
      } else {
        //compronar la contraseña
        bcrypt.compare(password, user.password, function (err, check) {
          if (check) {
            //devolver datos al usuario logeado
            if (params.gethash) {
              //devolver n token de jwt
              res.status(200).send({
                token: jwt.createToken(user),
              });
            } else {
              res.status(200).send({ user });
            }
          } else {
            res.status(404).send({ message: "La contraseña es incorrecta" });
          }
        });
      }
    }
  });
}

function updateUser(req, res) {
  var userId = req.params.id;
  var update = req.body;

  if (userId != req.user.sub) {
    return res
      .status(500)
      .send({ message: "No tienes persmiso para actualizar el usuario" });
  }

  User.findByIdAndUpdate(userId, update, (err, userUpdated) => {
    if (err) {
      res.status(500).send({ message: "Error al actualizar el usuario" });
    } else {
      if (!userUpdated) {
        res
          .status(404)
          .send({ message: "No se ha podido actualizar el usuario" });
      } else {
        res.status(200).send({ user: userUpdated });
      }
    }
  });
}

function uploadImage(req, res) {
  var userId = req.params.id;
  var file_name = "No subido...";

  if (req.files) {
    var file_path = req.files.image.path;
    var file_split = file_path.split("\\");
    var file_name = file_split[2];

    var ext_split = file_name.split(".");
    var file_ext = ext_split[1];
    // file_ext == "png" || file_ext == "jpg" || file_ext == "gif"
    if (
      file_ext == "JPG" ||
      file_ext == "JPEG" ||
      file_ext == "PNG" ||
      file_ext == "png" ||
      file_ext == "jpg" ||
      file_ext == "jpeg"
    ) {
      User.findByIdAndUpdate(
        userId,
        { image: file_name },
        (err, userUpdated) => {
          if (!userUpdated) {
            res
              .status(404)
              .send({ message: "No se ha podido actualizar el usuario" });
          } else {
            res.status(200).send({ image: file_name, user: userUpdated });
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
  var path_file = "./uploads/users/" + imageFile;
  fs.exists(path_file, function (exists) {
    if (exists) {
      res.sendFile(path.resolve(path_file));
    } else {
      res.status(200).send({ message: "No existe la imagen" });
    }
  });
}

function getUser(req, res) {
  var userId = req.params.id;
  User.findById(userId, (err, user) => {
    if (err) {
      res.status(200).send({ mesagge: "Error en la peticion" });
    } else {
      if (!user) {
        res.status(404).send({ mesagge: "El usuario no existe" });
      } else {
        res.status(200).send({ user });
      }
    }
  });
}

function deleteUser(req, res) {
  var userId = req.params.id;
  User.findByIdAndRemove(userId, (err, userRemoved) => {
    if (err) {
      res.status(500).send({ message: "Error en el servidor" });
    } else {
      if (!userRemoved) {
        res.status(404).send({ message: "No se ha borrado el usuario" });
      } else {
        res.status(200).send({ user: userRemoved });
      }
    }
  });
}
function editUser(req, res) {
  var userId = req.params.id;
  var edit = req.body;

  User.findByIdAndUpdate(userId, edit, (err, userUpdated) => {
    if (err) {
      res.status(500).send({ mesagge: "Error al guardar el artista" });
    } else {
      if (!userUpdated) {
        res.status(404).send({ mesagge: "El artista no ha sido actualizado" });
      } else {
        res.status(200).send({ user: userUpdated });
      }
    }
  });
}
function getUsers(req, res) {
  if (req.params.page) {
    var page = req.params.page;
  } else {
    var page = 1;
  }
  var itemsPerPag = 10;

  User.find()
    .sort("name")
    .paginate(page, itemsPerPag, function (err, users, total) {
      if (err) {
        res.status(500).send({ mesagge: "Error en la peticion" });
      } else {
        if (!users) {
          res.status(404).send({ mesagge: "No hay usuarios" });
        } else {
          return res.status(200).send({
            total_items: total,
            users: users,
          });
        }
      }
    });
}
module.exports = {
  pruebas,
  saveUser,
  loginUser,
  updateUser,
  uploadImage,
  getImageFile,
  getUsers,
  getUser,
  deleteUser,
  editUser,
};
