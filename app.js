"use strict";

var express = require("express");
var bodyParser = require("body-parser");
const multer = require("multer");
var app = express();
const path = require("path");

//cargar rutas
var user_routes = require("./router/user");
var artist_routes = require("./router/artist");
var album_routes = require("./router/album");
var song_routes = require("./router/song");
var codigo_routes = require("./router/codigo");
var codigoAlbum_routes = require("./router/codigoAlbum");
var cors = require("cors");
const codigo = require("./models/codigo");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// app.use(bodyParser.raw({type: "image/*",limit:'1mb'}));

app.use(express.static("public"));

//configurar cabecera http
app.use(cors(), (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Authorization,X-API-KEY,Origin,X-Requested-With,Content-Type,Accept,Acces-Control-Allow-Request-Method"
  );
  res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS,PUT,DELETE");
  res.header("Allow", "GET,POST,OPTIONS,PUT,DELETE");

  next();
});

//
// app.use(express.urlencoded({ extended: false }));
// const storage = multer.diskStorage({
//   destination: path.join(__dirname, "/uploads/artist"),
//   filename: (req, file, cb, filename) => {
//     console.log(file);
//     cb(null, new Date().getTime() + path.extname(file.originalname));
//   },
// });
// app.use(multer({ storage }).single("image"));
// cb(null, uuid() + path.extname(file.originalname));

//

//rutas base
app.use("/api", user_routes);
app.use("/api", artist_routes);
app.use("/api", album_routes);
app.use("/api", song_routes);
app.use("/api", codigo_routes);
app.use("/api", codigoAlbum_routes);

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "public/index.html"));
});
app.get("/prueba", function (req, res) {
  res.status(200).send({ message: "El servicio Fucniona Correctamente" });
});

// app.get("./pruebas", function (req, res) {
//   res.status(200).send({ message: "Bienvenido al PERRO CURSO" });
// });

module.exports = app;
