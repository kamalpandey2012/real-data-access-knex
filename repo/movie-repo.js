const promise = require("bluebird");
const db = require("../db");

//should return bluebird promise

module.exports = {
  //listTags function
  listTags: function() {
    return db
      .select("name as text", "id")
      .from("tag")
      .then();
  },
  listRatings: function() {
    return db
      .select("name as text", "id")
      .from("rating")
      .then();
  }
};
