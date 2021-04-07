"use strict";

var express = require("express");
var bodyParser = require("body-parser");

var app = express();

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

/*
(req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Authorization,X-API-KEY,Origin,X-Requested-With,Content-Type,Accept,Acces-Control-Allow-Request-Method"
  );
  res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS,PUT,DELETE");
  res.header("Allow", "GET,POST,OPTIONS,PUT,DELETE");

  next();
}
*/
//rutas base
app.use("/api", user_routes);
app.use("/api", artist_routes);
app.use("/api", album_routes);
app.use("/api", song_routes);
app.use("/api", codigo_routes);
app.use("/api", codigoAlbum_routes);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "bin/index.html"));
});
app.get("/prueba", function (req, res) {
  res.status(200).send({ message: "El servicio Fucniona Correctamente" });
});

// app.get("./pruebas", function (req, res) {
//   res.status(200).send({ message: "Bienvenido al PERRO CURSO" });
// });

module.exports = app;
