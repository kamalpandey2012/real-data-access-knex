const db = require("./db");
const display = require("./display");
const mRepo = require("./repo/movie-repo");
const pRepo = require("./repo/person-repo");

display.clear();

pRepo
  .listPersons("ca")
  .then(function(result) {
    display.write(result, "pretty");
  })
  .catch(function(err) {
    display.write(err);
  })
  .finally(function() {
    db.destroy();
  });
