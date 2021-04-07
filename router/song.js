"use strict";

var express = require("express");
var SongController = require("../controllers/song");
var api = express.Router();
var md_auth = require("../middlewares/authenticated");

var multipar = require("connect-multiparty");
var md_upload = multipar({ uploadDir: "./uploads/song" });
var md_uploadCancion = multipar({ uploadDir: "./uploads/cancion" });

api.get("/song/:id", md_auth.ensureAuth, SongController.getSong);
api.post("/song", md_auth.ensureAuth, SongController.saveSong);
api.get("/songs/:album?", md_auth.ensureAuth, SongController.getSongs);
api.put("/song/:id", md_auth.ensureAuth, SongController.updateSong);
api.delete("/song/:id", md_auth.ensureAuth, SongController.deleteSong);
api.post(
  "/upload-file-song/:id",
  [md_auth.ensureAuth, md_upload],
  SongController.uploadFile
);

api.get("/get-song-file/:songFile", SongController.getSongFile);

api.post(
  "/upload-image-song/:id",
  [md_auth.ensureAuth, md_uploadCancion],
  SongController.uploadImage
);

api.get("/get-image-song/:imageFile", SongController.getImageFile);

module.exports = api;
