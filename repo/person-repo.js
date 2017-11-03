const promise = require("bluebird");
const db = require("../db");

//should return bluebird promise

module.exports = {
  listPersons: function(searchText) {
    return db("person")
      .where("name", "like", "%" + searchText + "%")
      .select("name as text", "id")
      .orderBy("name")
      .then();
  }
};
