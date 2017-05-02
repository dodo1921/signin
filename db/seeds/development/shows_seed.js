
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('scores').del()
    .then(() => {
      return knex('users').del();
    })            
    .then(function () {
      // Inserts seed entries
           /*                                 
          return knex.insert({ active:1, name:'dodo', phone: 919005835709 })
          .returning('id')
          .into('users')
          .then(function (id) {
            // use id here
            console.log('>>>>'+id);
            return id;
          });
          */
          console.log('Here');

          return knex.table('users')
                     .returning('id')
                     .insert({
                        active:1, name:'dodo', phone: 919005835709
                     })
                     .then(function(id){

                        return knex.table('scores').insert({ user_id: id[0] });

                     });

    });
};
