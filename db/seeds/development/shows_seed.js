
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users1').insert([
        {username: "OMG", password: 'rowValue1'},
        {username: "OMG1", password: 'rowValue2'},
      ]);
    });
};
