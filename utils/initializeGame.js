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
        .then(()=>{
            return knex('scores').insert({
              user_id: userid               
            }).transacting(trx);
        })
        .then(()=>{
            return knex('wallet').insert({
              user_id: userid             
            }).transacting(trx);
        })
        .then(()=>{
            return knex('jewels').insert({
              user_id: userid,
              jeweltype_id: 0,
              count: 1,
              total_count:1               
            }).transacting(trx);
        })    
        .then(()=>{
            return knex('jewels').insert({
              user_id: userid,
              jeweltype_id: 1,
              count: 50,
              total_count: 50              
            }).transacting(trx);
        })
        .then(()=>{
            return knex('jewels').insert({
              user_id: userid,
              jeweltype_id: 2,
              count: 0,
              total_count: 0              
            }).transacting(trx);
        })
        .then(()=>{
            return knex('jewels').insert({
              user_id: userid,
              jeweltype_id: 3,
              count: 5,
              total_count: 5              
            }).transacting(trx);
        }) 
        .then(()=>{
            return knex('jewels').insert({
              user_id: userid,
              jeweltype_id: 4,
              count: 0,
              total_count: 0             
            }).transacting(trx);
        })
        .then(()=>{
            return knex('jewels').insert({
              user_id: userid,
              jeweltype_id: 5,
              count: 0,
              total_count: 0              
            }).transacting(trx);
        }) 
        .then(()=>{
            return knex('jewels').insert({
              user_id: userid,
              jeweltype_id: 6,
              count: 4,
              total_count: 4              
            }).transacting(trx);
        }) 
        .then(()=>{
            return knex('jewels').insert({
              user_id: userid,
              jeweltype_id: 7,
              count: 0,
              total_count: 0              
            }).transacting(trx);
        }) 
        .then(()=>{
            return knex('jewels').insert({
              user_id: userid,
              jeweltype_id: 8,
              count: 0,
              total_count: 0              
            }).transacting(trx);
        }) 
        .then(()=>{
            return knex('jewels').insert({
              user_id: userid,
              jeweltype_id: 9,
              count: 3,
              total_count: 3              
            }).transacting(trx);
        }) 
        .then(()=>{
            return knex('jewels').insert({
              user_id: userid,
              jeweltype_id: 10,
              count: 0,
              total_count: 0              
            }).transacting(trx);
        }) 
        .then(()=>{
            return knex('jewels').insert({
              user_id: userid,
              jeweltype_id: 11,
              count: 0,
              total_count: 0              
            }).transacting(trx);
        }) 
        .then(()=>{
            return knex('jewels').insert({
              user_id: userid,
              jeweltype_id: 12,
              count: 2,
              total_count: 2              
            }).transacting(trx);
        }) 
        .then(()=>{
            return knex('jewels').insert({
              user_id: userid,
              jeweltype_id: 13,
              count: 0,
              total_count: 0              
            }).transacting(trx);
        }) 
        .then(()=>{
            return knex('jewels').insert({
              user_id: userid,
              jeweltype_id: 14,
              count: 0,
              total_count: 0              
            }).transacting(trx);
        }) 
        .then(()=>{
            return knex('jewels').insert({
              user_id: userid,
              jeweltype_id: 15,
              count: 1,
              total_count: 1              
            }).transacting(trx);
        }) 
        .then(()=>{
            return knex('jewels').insert({
              user_id: userid,
              jeweltype_id: 16,
              count: 0,
              total_count: 0             
            }).transacting(trx);
        })
        .then(()=>{
            return knex('jewels').insert({
              user_id: userid,
              jeweltype_id: 17,
              count: 0,
              total_count: 0             
            }).transacting(trx);
        })
        .then(()=>{
            return knex('taskusers').insert({
              user_id: userid,
              task_id: 1                          
            }).transacting(trx);
        })
        .then(()=>{
            return knex('taskusers').insert({
              user_id: userid,
              task_id: 2                          
            }).transacting(trx);
        })
        .then(()=>{
            return knex('taskusers').insert({
              user_id: userid,
              task_id: 3                          
            }).transacting(trx);
        }) 
        .then(()=>{
            return knex('taskusers').insert({
              user_id: userid,
              task_id: 4                          
            }).transacting(trx);
        }) 
        .then(()=>{
            return knex('taskusers').insert({
              user_id: userid,
              task_id: 5                          
            }).transacting(trx);
        }) 
        .then(()=>{
            return knex('taskusers').insert({
              user_id: userid,
              task_id: 6                          
            }).transacting(trx);
        }) 
        .then(()=>{
            return knex('taskusers').insert({
              user_id: userid,
              task_id: 7                          
            }).transacting(trx);
        }) 
        .then(()=>{
            return knex('taskusers').insert({
              user_id: userid,
              task_id: 8                          
            }).transacting(trx);
        }) 
        .then(()=>{
            return knex('taskusers').insert({
              user_id: userid,
              task_id: 9                          
            }).transacting(trx);
        }) 
        .then(()=>{
            return knex('taskusers').insert({
              user_id: userid,
              task_id: 10                          
            }).transacting(trx);
        }) 
        .then(()=>{
            return knex('taskusers').insert({
              user_id: userid,
              task_id: 11                          
            }).transacting(trx);
        }) 
        .then(()=>{
            return knex('taskusers').insert({
              user_id: userid,
              task_id: 12                          
            }).transacting(trx);
        }) 
        .then(()=>{
            return knex('taskusers').insert({
              user_id: userid,
              task_id: 13                          
            }).transacting(trx);
        }) 
        .then(()=>{
            return knex('taskusers').insert({
              user_id: userid,
              task_id: 14                          
            }).transacting(trx);
        }) 
        .then(()=>{
            return knex('taskusers').insert({
              user_id: userid,
              task_id: 15                          
            }).transacting(trx);
        }) 
        .then(()=>{
            return knex('taskusers').insert({
              user_id: userid,
              task_id: 16                          
            }).transacting(trx);
        }) 
        .then(()=>{
            return knex('taskusers').insert({
              user_id: userid,
              task_id: 17                          
            }).transacting(trx);
        }) 
        .then(()=>{
            return knex('taskusers').insert({
              user_id: userid,
              task_id: 18                          
            }).transacting(trx);
        }) 
        .then(()=>{
            return knex('taskusers').insert({
              user_id: userid,
              task_id: 19                          
            }).transacting(trx);
        }) 
        .then(()=>{
            return knex('taskusers').insert({
              user_id: userid,
              task_id: 20                          
            }).transacting(trx);
        })
        .then(()=>{
            return knex('achievementusers').insert({
              user_id: userid,
              achievement_id: 1                          
            }).transacting(trx);
        })
        .then(()=>{
            return knex('achievementusers').insert({
              user_id: userid,
              achievement_id: 2                          
            }).transacting(trx);
        })
        .then(()=>{
            return knex('achievementusers').insert({
              user_id: userid,
              achievement_id: 3                          
            }).transacting(trx);
        })
        .then(()=>{
            return knex('achievementusers').insert({
              user_id: userid,
              achievement_id: 4                          
            }).transacting(trx);
        })
        .then(()=>{
            return knex('achievementusers').insert({
              user_id: userid,
              achievement_id: 5                          
            }).transacting(trx);
        })
        .then(()=>{
            return knex('achievementusers').insert({
              user_id: userid,
              achievement_id: 6                          
            }).transacting(trx);
        })
        .then(()=>{
            return knex('achievementusers').insert({
              user_id: userid,
              achievement_id: 7                          
            }).transacting(trx);
        })
        .then(()=>{
            return knex('achievementusers').insert({
              user_id: userid,
              achievement_id: 8                          
            }).transacting(trx);
        })
        .then(()=>{
            return knex('achievementusers').insert({
              user_id: userid,
              achievement_id: 9                          
            }).transacting(trx);
        })
        .then(()=>{
            return knex('achievementusers').insert({
              user_id: userid,
              achievement_id: 10                          
            }).transacting(trx);
        })
        .then(()=>{
            return knex('achievementusers').insert({
              user_id: userid,
              achievement_id: 11                          
            }).transacting(trx);
        })
        .then(()=>{
            return knex('achievementusers').insert({
              user_id: userid,
              achievement_id: 12                          
            }).transacting(trx);
        })
        .then(()=>{
            return knex('achievementusers').insert({
              user_id: userid,
              achievement_id: 13                          
            }).transacting(trx);
        })
        .then(()=>{
            return knex('achievementusers').insert({
              user_id: userid,
              achievement_id: 14                          
            }).transacting(trx);
        })
        .then(()=>{
            return knex('achievementusers').insert({
              user_id: userid,
              achievement_id: 15                          
            }).transacting(trx);
        })
        .then(()=>{
            return knex('achievementusers').insert({
              user_id: userid,
              achievement_id: 16                          
            }).transacting(trx);
        })
        .then(()=>{
            return knex('achievementusers').insert({
              user_id: userid,
              achievement_id: 17                          
            }).transacting(trx);
        })
        .then(()=>{
            return knex('achievementusers').insert({
              user_id: userid,
              achievement_id: 18                          
            }).transacting(trx);
        })
        .then(()=>{
            return knex('achievementusers').insert({
              user_id: userid,
              achievement_id: 19                          
            }).transacting(trx);
        })
        .then(()=>{
            return knex('achievementusers').insert({
              user_id: userid,
              achievement_id: 20                          
            }).transacting(trx);
        })
        .then(()=>{
            return knex('achievementusers').insert({
              user_id: userid,
              achievement_id: 21                          
            }).transacting(trx);
        })
        .then(()=>{
            return knex('achievementusers').insert({
              user_id: userid,
              achievement_id: 22                          
            }).transacting(trx);
        })
        .then(()=>{
            return knex('achievementusers').insert({
              user_id: userid,
              achievement_id: 23                          
            }).transacting(trx);
        })
        .then(()=>{
            return knex('achievementusers').insert({
              user_id: userid,
              achievement_id: 24                          
            }).transacting(trx);
        })
        .then(()=>{
            return knex('achievementusers').insert({
              user_id: userid,
              achievement_id: 25                          
            }).transacting(trx);
        })
        .then(()=>{
            return knex('achievementusers').insert({
              user_id: userid,
              achievement_id: 26                          
            }).transacting(trx);
        })
        .then(()=>{
            return knex('achievementusers').insert({
              user_id: userid,
              achievement_id: 27                          
            }).transacting(trx);
        })
        .then(()=>{
            return knex('achievementusers').insert({
              user_id: userid,
              achievement_id: 28                          
            }).transacting(trx);
        })
        .then(()=>{
            return knex('achievementusers').insert({
              user_id: userid,
              achievement_id: 29                          
            }).transacting(trx);
        })
        .then(()=>{
            return knex('achievementusers').insert({
              user_id: userid,
              achievement_id: 30                          
            }).transacting(trx);
        })
        .then(()=>{
            return knex('achievementusers').insert({
              user_id: userid,
              achievement_id: 31                          
            }).transacting(trx);
        })
        .then(()=>{
            return knex('achievementusers').insert({
              user_id: userid,
              achievement_id: 32                          
            }).transacting(trx);
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
