const db = require("./db");
const display = require("./display");
const mRepo = require("./repo/movie-repo");

display.clear();

mRepo
  .listRatings()
  .then(function(result) {
    display.write(result, "pretty");
  })
  .catch(function(err) {
    display.write(err);
  })
  .finally(function() {
    db.destroy();
  });
