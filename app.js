const db = require("./db");
const display = require("./display");
const mRepo = require("./repo/movie-repo");
const pRepo = require("./repo/person-repo");

const qf = {
  pgSize: 2,
  pgNum: 1,
  sort: "title"
};
display.clear();

const edward = { firstname: "Edward", lastname: "Zwick", name: "Edward Zwick" };

const movie = {
  id: 0, //new movie
  rating_id: 4, //R
  director_id: 42,
  actors: [16, 42],
  tags: [12, 7],
  title: "The Last Samurai!",
  releaseyr: 2003,
  score: 10,
  runtime: 154,
  lastplaydt: "2015-10-20",
  overview:
    "An American security advisor falls into the lifestyle of Samurai, He was employed by emperor to destroy the Samurai lands"
};

mRepo
  .update(movie)
  .then(function(result) {
    display.write(result, "pretty");
  })
  .catch(function(err) {
    display.write(err);
  })
  .finally(function() {
    db.destroy();
  });
