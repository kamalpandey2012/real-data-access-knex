const promise = require("bluebird");
const db = require("../db");
const util = require("../db-util");

//should return bluebird promise
module.exports = {
  listTags: listTags,
  listRatings: listRatings,
  getMovie: getMovie,
  listTagsFor: listTagsFor,
  listActorsFor: listActorsFor,
  getMovieFull: getMovieFull,
  listMovies: listMovies
};
//list all tags
function listTags() {
  return db
    .select("name as text", "id")
    .from("tag")
    .then();
}

// list all rating
function listRatings() {
  return db
    .select("name as text", "id")
    .from("rating")
    .then();
}

//get movie of given id
function getMovie(movie_id) {
  return db("movie as m")
    .join("person as p", "p.id", "m.director_id")
    .select("m.*", "p.name as director")
    .where("m.id", movie_id)
    .first()
    .then();
}

// list tags for a particular movie
function listTagsFor(movie_id) {
  return db("tag as t")
    .select("t.id", "t.name as text")
    .joinRaw(
      "JOIN tag_movie tm ON tm.tag_id = t.id AND tm.movie_id=?",
      movie_id
    )
    .then();
}

//list all the actors for a specific movie
function listActorsFor(movie_id) {
  return db("person as p")
    .select(db.raw("p.id, p.firstname ||' '|| p.lastname as text"))
    .joinRaw(
      "JOIN actor_movie am ON am.person_id = p.id AND am.movie_id=?",
      movie_id
    )
    .then();
}

//list all elements of movie
function getMovieFull(movie_id) {
  const pMovie = this.getMovie(movie_id),
    pTag = this.listTagsFor(movie_id),
    pActor = this.listActorsFor(movie_id);

  return promise.all([pMovie, pTag, pActor]).then(function(results) {
    let movie = results[0];
    movie.tags = results[1];
    movie.actors = results[2];
    return movie;
  });
}

//list movies matching the given sort filter
function listMovies(qf) {
  const result = {},
    sort = util.parseSortString(qf.sort, "m.id"),
    pg_size = Math.min(qf.pgSize, 10),
    offset = (qf.pgNum - 1) * pg_size;
  return db("movie")
    .count("* as total")
    .then(function(rows) {
      result.total = rows[0].total;
    })
    .then(function() {
      return db("movie as m")
        .select(
          "m.id",
          "m.title",
          "m.releaseyr",
          "m.runtime",
          "m.lastplaydt",
          "r.name as rating"
        )
        .join("rating as r", "r.id", "m.rating_id")
        .limit(pg_size)
        .offset(offset)
        .then();
    })
    .then(function(rows) {
      result.pgSize = pg_size;
      result.items = rows;
      return result;
    });
}
