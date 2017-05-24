
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries

  return Promise.join(
    // Deletes ALL existing entries
    
    knex('taskdetails').del(),
    knex('tasks').del()
       
  ) 
  .then(() => {    

        return knex.table('tasks')
                   .returning('id')
                   .insert({
                      points:50, coins:10
                   })
                   .then(function(id){

                      return Promise.join(
                        // Deletes ALL existing entries
                        knex.table('taskdetails').insert({task_id: id, jeweltype_id: 3, count: 3 }),
                        knex.table('taskdetails').insert({task_id: id, jeweltype_id: 4, count: 2 }),
                        knex.table('taskdetails').insert({task_id: id, jeweltype_id: 5, count: 1 }) 
                      );

                   });

  })
  .then(() => {    

        return knex.table('tasks')
                   .returning('id')
                   .insert({
                      points:150, coins:40
                   })
                   .then(function(id){

                      return Promise.join(
                        // Deletes ALL existing entries
                        knex.table('taskdetails').insert({task_id: id, jeweltype_id: 3, count: 8 }),
                        knex.table('taskdetails').insert({task_id: id, jeweltype_id: 4, count: 5 }),
                        knex.table('taskdetails').insert({task_id: id, jeweltype_id: 5, count: 1 }) 
                      );

                   });

  })
  .then(() => {    

        return knex.table('tasks')
                   .returning('id')
                   .insert({
                      points:80, coins:20, money: 1
                   })
                   .then(function(id){

                      return Promise.join(
                        // Deletes ALL existing entries
                        knex.table('taskdetails').insert({task_id: id, jeweltype_id: 3, count: 3 }),
                        knex.table('taskdetails').insert({task_id: id, jeweltype_id: 4, count: 2 }),
                        knex.table('taskdetails').insert({task_id: id, jeweltype_id: 1, count: 1 }) 
                      );

                   });

  });

};
