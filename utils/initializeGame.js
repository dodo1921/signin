'use strict';

let knex = require('../db/knex');


module.exports = function(userid) {

  //factory 
  knex.transaction( trx => {      

        knex('factoryuser').insert({ factory_id:1, user_id: userid }).transacting(trx)
        .then( () =>{
          return knex('factoryuser').insert({ factory_id:2, user_id: userid }).transacting(trx);
        })
        .then( () =>{
          return knex('factoryuser').insert({ factory_id:3, user_id: userid }).transacting(trx);
        })
        .then( () =>{
          return knex('factoryuser').insert({ factory_id:4, user_id: userid }).transacting(trx);
        })
        .then( () =>{
          return knex('factoryuser').insert({ factory_id:5, user_id: userid }).transacting(trx);
        })
        .then( () =>{
          return knex('factoryuser').insert({ factory_id:6, user_id: userid }).transacting(trx);
        })
        .then( () =>{
          return knex('factoryuser').insert({ factory_id:7, user_id: userid }).transacting(trx);
        })
        .then( () =>{
          return knex('factoryuser').insert({ factory_id:8, user_id: userid }).transacting(trx);
        })
        .then( () =>{
          return knex('factoryuser').insert({ factory_id:9, user_id: userid }).transacting(trx);
        })
        .then( () =>{
          return knex('factoryuser').insert({ factory_id:10, user_id: userid }).transacting(trx);
        })
        .then( () =>{
          return knex('users').where({ id: userid }).update({ initialized: true }).transacting(trx);
        })
        .then(trx.commit)
        .catch(trx.rollback);

  })
  .then( values => {
    
  })
  .catch( err => {
    
  });
    
};
