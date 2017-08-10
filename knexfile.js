'use strict';

module.exports = {
  test: {
    client: 'mysql',
    connection: 'localhost',
    migrations: {
      directory: __dirname + '/db/migrations'
    },
    seeds: {
      directory: __dirname + '/db/seeds/test'
    }
  },
  /*
  development: {
    client: 'mysql',
    connection: {
      host: '130.211.206.90',
      user: 'root',
      password: 'jc',
      database: 'jc',
      charset: 'utf8'
    },
    migrations: {
      directory: __dirname + '/db/migrations'
    },
    seeds: {
      directory: __dirname + '/db/seeds/development'
    }
  },
  */  
  development: {
    client: 'mysql',
    connection: {
      host: '127.0.0.1',
      user: 'root',
      password: '',
      database: 'test',
      charset: 'utf8mb4'
    },
    migrations: {
      directory: __dirname + '/db/migrations'
    },
    seeds: {
      directory: __dirname + '/db/seeds/development'
    }
  },
  production: {
    client: 'mysql',
    connection: {
      socketPath: `/cloudsql/${process.env.durl}`,
      user: process.env.dusername,
      password: process.env.dpassword,
      database: 'jc',
      charset: 'utf8'
    },
    migrations: {
      directory: __dirname + '/db/migrations'
    },
    seeds: {
      directory: __dirname + '/db/seeds/production'
    }
  }
};

