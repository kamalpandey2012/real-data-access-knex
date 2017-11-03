//export knex instance so that it could be used throuhout the application
const config = require("./knexfile");
const knex = require("knex")(config.development);

module.exports = knex;
