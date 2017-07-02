'use strict'

const  Memcached = require('memcached');

const memcached = new Memcached( ( process.env.MEMCACHE || 'localhost' ) + ':11211',{retries:1, failures:1, retry: 300});

module.exports = memcached; 