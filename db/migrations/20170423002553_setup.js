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
      table.timestamps().defaultTo(knex.fn.now());

      table.unique(['phone']);
      table.index(['reference']);
      table.index(['deviceId1']);
      table.index(['deviceId2']);
    }),
    knex.schema.createTable('scores', function(table){
    	table.increments('id');
    	table.integer('user_id').unsigned().notNull();    	
    	table.integer('level').defaultTo(1).notNull();
    	table.integer('points').defaultTo(5).notNull();
    	table.integer('max_level_points').defaultTo(55).notNull();
    	table.integer('coins').defaultTo(10).notNull();
    	table.integer('diamond').defaultTo(2).notNull();
    	table.integer('storesize').defaultTo(25).notNull();

    	table.foreign('user_id').references('users.id');
    }),
    knex.schema.createTable('jeweltype', function(table){
    	table.increments('id');
    	table.string('name').notNull();
    }),
    knex.schema.createTable('jewels', function(table){
    	table.increments('id');
    	table.integer('user_id').notNull();   	
    	table.integer('jeweltype_id').notNull();    	
    	table.integer('count').defaultTo(0);
    	table.integer('total_count').defaultTo(0);
    	table.timestamp('updated_at').defaultTo(knex.fn.now());

    	table.index(['user_id']);
    	table.foreign('user_id').references('users.id');

    	table.foreign('jeweltype_id').references('jewels.id');    	   	
    }),
    knex.schema.createTable('tasks', function(table){
    	table.increments('id');
    	table.timestamp('duration').nullable();
    	table.integer('coins').nullable();
    	table.integer('points').notNull();
    	table.integer('money').nullable();
    	table.integer('level').nullable();
    	table.timestamp('created_at').defaultTo(knex.fn.now());  	   	
    }),
    knex.schema.createTable('taskdetails', function(table){
    	table.increments('id');
    	table.integer('task_id').notNull();
    	table.integer('jeweltype_id').notNull();
    	table.integer('count').notNull();

    	table.foreign('task_id').references('tasks.id'); 	   	
    }),


  ])
};

exports.down = function(knex, Promise) {  
  return Promise.all([
    knex.schema.dropTable('Users')    
  ])
};