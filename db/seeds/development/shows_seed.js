
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries

  return Promise.join(
    // Deletes ALL existing entries
    knex('jeweltype').del(),
    knex('tasks').del(),
    knex('taskdetails').del(),
    knex('achievements').del(),
    knex('factory').del(),
    knex('factorymaterial').del()    
  )
  .then(()=>{
      return knex('jeweltype').insert({
        name: 'diamond',
        min_cost: 5000
      });
  })
  .then(()=>{
      return knex('jeweltype').insert({
        name: 'coin',
        min_cost: 5000
      });
  })
  .then(()=>{
      return knex('jeweltype').insert({
        name: 'j1',
        min_cost: 5000
      });
  })
  .then(()=>{
      return knex('jeweltype').insert({
        name: 'j2',
        min_cost: 5000
      });
  })
  .then(()=>{
      return knex('jeweltype').insert({
        name: 'j3',
        min_cost: 5000
      });
  })
  .then(()=>{
      return knex('jeweltype').insert({
        name: 'j4',
        min_cost: 5000
      });
  })
  .then(()=>{
      return knex('jeweltype').insert({
        name: 'j5',
        min_cost: 5000
      });
  })
  .then(()=>{
      return knex('jeweltype').insert({
        name: 'j6',
        min_cost: 5000
      });
  })
  .then(()=>{
      return knex('jeweltype').insert({
        name: 'j7',
        min_cost: 5000
      });
  })
  .then(()=>{
      return knex('jeweltype').insert({
        name: 'j8',
        min_cost: 5000
      });
  })
  .then(()=>{
      return knex('jeweltype').insert({
        name: 'j9',
        min_cost: 5000
      });
  })
  .then(()=>{
      return knex('jeweltype').insert({
        name: 'j10',
        min_cost: 5000
      });
  })
  .then(()=>{
      return knex('jeweltype').insert({
        name: 'j11',
        min_cost: 5000
      });
  })
  .then(()=>{
      return knex('jeweltype').insert({
        name: 'j12',
        min_cost: 5000
      });
  })


  
};
