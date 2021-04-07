"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var CodigoSchema = Schema({
  name: String,
  image: String,
  song: { type: Schema.ObjectId, ref: "Song" },
  // artist: { type: Schema.ObjectId, ref: "Artist" },
  // album: { type: Schema.ObjectId, ref: "Album" },
});

module.exports = mongoose.model("Codigo", CodigoSchema);
