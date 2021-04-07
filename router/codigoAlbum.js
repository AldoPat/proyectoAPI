"use strict";

var express = require("express");
var CodigoAlbumController = require("../controllers/codigoAlbum");
var api = express.Router();
var md_auth = require("../middlewares/authenticated");

var multipar = require("connect-multiparty");
var md_upload = multipar({ uploadDir: "./uploads/codigoAlbum" });

// api.get("/codigos/:song?", md_auth.ensureAuth, CodigoController.getCodigos);

api.get(
  "/codigosalbums/:album?",
  md_auth.ensureAuth,
  CodigoAlbumController.getCodigos
);
api.get(
  "/codigoAlbum/:id",
  md_auth.ensureAuth,
  CodigoAlbumController.getCodigo
);
api.post("/codigoAlbum", md_auth.ensureAuth, CodigoAlbumController.saveCodigo);
api.put(
  "/codigoAlbum/:id",
  md_auth.ensureAuth,
  CodigoAlbumController.updateCodigo
);
api.delete(
  "/codigoAlbumId/:id",
  md_auth.ensureAuth,
  CodigoAlbumController.deleteCodigo
);
api.post(
  "/upload-image-codigoAlbum/:id",
  [md_auth.ensureAuth, md_upload],
  CodigoAlbumController.uploadImage
);
api.get(
  "/get-image-codigoAlbum/:imageFile",
  CodigoAlbumController.getImageFile
);

module.exports = api;
