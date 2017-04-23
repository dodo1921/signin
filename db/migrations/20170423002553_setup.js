exports.up = function(knex, Promise) {  
  return Promise.all([
    knex.schema.createTable('users', function(table){
    	table.increments('id');	
      table.bigInteger('phone').unsigned().notNull();
      table.string('name').notNull();
      table.bigInteger('reference').unsigned().nullable();
      table.string('deviceId1').nullable();
      table.string('deviceId2').nullable();
      table.boolean('active').notNull();
      table.boolean('is_rooted').nullable();      
      table.timestamps();
      table.unique(['phone']);
      table.index(['reference']);
      table.index(['deviceId1']);
      table.index(['deviceId2']);
    }),
    knex.schema.createTable('scores', function(table){
    	table.increments('id');
    	table.integer('user_id').unsigned().notNull();
    	table.foreign('user_id').references('users.id');
    	table.integer('level').defaultTo(1).notNull();
    	table.integer('points').defaultTo(5).notNull();
    	table.integer('max_level_points').defaultTo(55).notNull();
    	table.integer('coins').defaultTo(10).notNull();
    	table.integer('diamond').defaultTo(2).notNull();
    	table.integer('storesize').defaultTo(25).notNull();
    }),
    knex.schema.createTable('jeweltype', function(table){
    	table.increments('id');
    	table.string('name').notNull();
    }),
    knex.schema.createTable('jewels', function(table){
    	table.bigIncrements('id');
    	table.integer('user_id').notNull();
    	table.integer('jeweltype_id').notNull();
    }),

  ])
};

exports.down = function(knex, Promise) {  
  return Promise.all([
    knex.schema.dropTable('Users')    
  ])
};