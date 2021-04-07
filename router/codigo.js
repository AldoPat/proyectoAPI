"use strict";

var express = require("express");
var CodigoController = require("../controllers/codigo");
var api = express.Router();
var md_auth = require("../middlewares/authenticated");

var multipar = require("connect-multiparty");
var md_upload = multipar({ uploadDir: "./uploads/codigo" });

api.get("/codigos/:song?", md_auth.ensureAuth, CodigoController.getCodigos);
api.get("/codigo/:id", md_auth.ensureAuth, CodigoController.getCodigo);
api.post("/codigo", md_auth.ensureAuth, CodigoController.saveCodigo);
api.put("/codigo/:id", md_auth.ensureAuth, CodigoController.updateCodigo);
api.delete("/codigo/:id", md_auth.ensureAuth, CodigoController.deleteCodigo);
api.post(
  "/upload-image-codigo/:id",
  [md_auth.ensureAuth, md_upload],
  CodigoController.uploadImage
);
api.get("/get-image-codigo/:imageFile", CodigoController.getImageFile);

module.exports = api;
