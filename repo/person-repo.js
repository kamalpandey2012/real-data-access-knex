const promise = require("bluebird");
const db = require("../db");

//should return bluebird promise

module.exports = {
  listPersons: function(searchText) {
    return (
      db("person")
        // .where("name", "like", "%" + searchText + "%")
        .whereRaw("LOWER(name) like '%' || LOWER(?)|| '%'", searchText)
        .select("name as text", "id")
        .orderBy("name")
        .then()
    );
  }
};
