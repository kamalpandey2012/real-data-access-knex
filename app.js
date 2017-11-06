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

mRepo
  .deleteMovie(8)
  .then(function(result) {
    display.write(result, "pretty");
  })
  .catch(function(err) {
    display.write(err);
  })
  .finally(function() {
    db.destroy();
  });
