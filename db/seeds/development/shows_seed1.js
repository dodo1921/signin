
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries

  return Promise.join(
    // Deletes ALL existing entries
    
    knex('tasks').del(),
    knex('taskdetails').del()
       
  ) 
  .then(function () {    

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

  });
};
