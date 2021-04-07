"use strict";

const mongoose = require("mongoose");
var app = require("./app");
var port = process.env.PORT || 3978;

mongoose.set("useFindAndModify", false);
mongoose.Promise = global.Promise;

mongodb: mongoose.connect(
  // "mongodb+srv://@app-music.6co8z.mongodb.net/Musica?retryWrites=true&w=majority",
  "mongodb+srv://admin:1234@app-music.6co8z.mongodb.net/Musica?retryWrites=true&w=majority",
  // "mongodb://localhost:27017/music-curso",
  { useNewUrlParser: true, useUnifiedTopology: true },

  (err, res) => {
    if (err) {
      throw err;
    } else {
      console.log("Funcionamiento Correcto");
      app.listen(port, function () {
        console.log(
          "Servidor del api rest de musica escuchando en http://localhost:" +
            port
        );
      });
    }
  }
);
