"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var SongSchema = Schema({
  number: String,
  name: String,
  duration: String,
  file: String,
  image: String,
  album: { type: Schema.ObjectId, ref: "Album" },
  // album: { type: Schema.ObjectId, ref: "Artist" },
  artist: { type: Schema.ObjectId, ref: "Artist" },
});

module.exports = mongoose.model("Song", SongSchema);
