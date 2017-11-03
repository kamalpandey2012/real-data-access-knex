// Update with your config settings.

module.exports = {

  development: {
    client: 'sqlite3',
    connection: { filename: './movie.sqlite' },
    migrations:{tableName: 'knex_migrations'},
    seed: { directory: './seeds'},
    debug:false
  },

  staging: {
    client: 'pg',
    connection: {
      host: 'localhost',
      user:     'kamalpandey',
      database: 'movie_staging',
      password: ''
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    },
    seed:{directory:'./seed'}
  },

  production: {
    client: 'pg',
    connection: {
      host: 'localhost',
      user:'kamalpandey',
      database:'movie',
      password:''
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {tableName: 'knex_migrations'},
    seed:{directory: './seed'}
  },
  debug:false

};
