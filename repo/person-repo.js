const promise = require("bluebird");
const db = require("../db");

module.exports = {
  listPersons: listPersons,
  add: add
};

//should return bluebird promise

function listPersons(searchText) {
  return (
    db("person")
      // .where("name", "like", "%" + searchText + "%")
      .whereRaw("LOWER(name) like '%' || LOWER(?)|| '%'", searchText)
      .select("name as text", "id")
      .orderBy("name")
      .then()
  );
}

function add(person) {
  return db("person")
    .insert(person, "id")
    .then();
}
