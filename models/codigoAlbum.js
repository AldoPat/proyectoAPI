"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var CodigoAlbumSchema = Schema({
  name: String,
  image: String,
  album: { type: Schema.ObjectId, ref: "Album" },
});

module.exports = mongoose.model("CodigoAlbum", CodigoAlbumSchema);
