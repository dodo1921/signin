'use strict';

exports.up = function(knex, Promise) {  
  return Promise.all([
    knex.schema.createTable('users', function(table){
      table.increments('id');	
      table.bigInteger('phone').unsigned().notNull();
      table.string('name').notNull();
      table.string('status', 1000).notNull();
      table.string('pic').notNull();
      table.bigInteger('reference').unsigned().nullable();
      table.string('deviceId1').nullable();
      table.string('deviceId2').nullable();
      table.string('token_google').nullable();
      table.string('token_apple').nullable();      
      table.boolean('active').defaultTo(false);
      table.boolean('is_rooted').nullable();      
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());

      table.unique(['phone']);
      table.index(['reference']);
      table.index(['deviceId1']);
      table.index(['deviceId2']);
    }),

    knex.schema.createTable('pic', function(table){
      table.increments('id');
      table.integer('user_id').unsigned().notNull();      
      table.string('small').nullable();
      table.string('large').nullable();
      table.boolean('is_profile').defaultTo(false);

      table.index(['user_id']);
      table.foreign('user_id').references('users.id');
    }),

    knex.schema.createTable('chats', function(table){
      table.increments('id');
      table.integer('sender_id').unsigned().notNull(); 
      table.integer('receiver_id').unsigned().notNull(); 
      table.integer('chatroom').unsigned().notNull();      
      table.string('msg', 5000).notNull();      
      table.boolean('is_group').defaultTo(false);

      table.index(['sender_id']);
      table.index(['receiver_id']);
      table.index([ 'chatroom', 'is_group' ]);
      table.foreign('sender_id').references('users.id');
      table.foreign('receiver_id').references('users.id');

    }),

    knex.schema.createTable('groups', function(table){
      table.increments('id');           
      table.string('small').nullable();
      table.string('large').nullable();
      table.string('name').notNull();
      table.string('status', 1000).nullable();
      
    }),

    knex.schema.createTable('groupmembers', function(table){
      table.increments('id');
      table.integer('user_id').unsigned().notNull(); 
      table.integer('group_id').unsigned().notNull();      
      
      table.boolean('is_admin').defaultTo(false);

      table.index(['group_id']);
      table.foreign('user_id').references('users.id');
      table.foreign('group_id').references('groups.id');
    }),

    knex.schema.createTable('scores', function(table){
    	table.increments('id');
    	table.integer('user_id').unsigned().notNull();    	
    	table.integer('level').defaultTo(1).notNull();
    	table.integer('points').defaultTo(5).notNull();
    	table.integer('max_level_points').defaultTo(55).notNull();    	
    	table.integer('storesize').defaultTo(25).notNull();

    	table.index(['user_id']);
    	table.foreign('user_id').references('users.id');
    }),

    knex.schema.createTable('jeweltype', function(table){
    	table.increments('id');
    	table.string('name').notNull();
    	table.integer('min_cost').notNull();    	
    }),

    knex.schema.createTable('jewels', function(table){
    	table.increments('id');
    	table.integer('user_id').unsigned().notNull();   	
    	table.integer('jeweltype_id').unsigned().notNull();    	
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
    	table.integer('task_id').unsigned().notNull();
    	table.integer('jeweltype_id').unsigned().notNull();
    	table.integer('count').notNull();

    	table.index(['task_id']);
    	table.foreign('task_id').references('tasks.id');
    	table.foreign('jeweltype_id').references('jeweltype.id'); 	   	
    }),

    knex.schema.createTable('taskusers', function(table){
    	table.increments('id');
    	table.integer('task_id').unsigned().notNull();
    	table.integer('user_id').unsigned().notNull();
    	table.boolean('done').defaultTo(false);

    	table.index(['user_id']);
    	table.foreign('task_id').references('tasks.id');
    	table.foreign('user_id').references('users.id'); 	   	
    }),

    knex.schema.createTable('achievements', function(table){
    	table.increments('id');
    	table.integer('diamond').notNull();
    	table.string('text').notNull();    		   	
    }),    

    knex.schema.createTable('achievementusers', function(table){
    	table.increments('id');
    	table.integer('achievement_id').unsigned().notNull();
    	table.integer('user_id').unsigned().notNull();
    	table.integer('level').notNull();	
    	
    	table.index(['achievement_id']);
    	table.foreign('achievement_id').references('achievements.id');	   	
    }),    

    knex.schema.createTable('factory', function(table){
    	table.increments('id');
    	table.integer('jeweltype_id').unsigned().notNull();
    	table.integer('level').notNull();
    	table.integer('diamond').notNull();	
    	table.integer('duration').notNull();

    	table.foreign('jeweltype_id').references('jeweltype.id'); 
    	   	
    }),

    knex.schema.createTable('factorymaterial', function(table){
    	table.increments('id');
    	table.integer('factory_id').unsigned().notNull();
    	table.integer('jeweltype_id').unsigned().notNull();
    	table.integer('count').notNull();	
    	
    	table.foreign('factory_id').references('factory.id');	
    	table.foreign('jeweltype_id').references('jeweltype.id');	   	
    }),

    knex.schema.createTable('factoryuser', function(table){
    	table.increments('id');
    	table.integer('factory_id').unsigned().notNull();
    	table.integer('user_id').unsigned().notNull();    	
    	
    	table.foreign('factory_id').references('factory.id');	
    	table.foreign('user_id').references('users.id');	   	
    }),

    knex.schema.createTable('factorylogs', function(table){
    	table.increments('id');
    	table.integer('factory_id').unsigned().notNull();
    	table.integer('user_id').unsigned().notNull(); 
    	table.timestamp('start_time').notNull();   	
    	table.timestamp('end_time').nullable();
    	table.boolean('diamond_used').nullable(); 

    	table.foreign('factory_id').references('factory.id');	
    	table.foreign('user_id').references('users.id');	   	
    }),

    knex.schema.createTable('market', function(table){
    	table.increments('id');
    	table.integer('seller_id').unsigned().notNull();
    	table.integer('buyer_id').unsigned().notNull();
    	table.integer('cost').notNull();
    	table.integer('count').notNull();
    	table.integer('jeweltype_id').unsigned().notNull();
    	table.boolean('done').defaultTo(false);

    	table.index(['seller_id']);
    	table.index(['buyer_id']);

    	table.foreign('seller_id').references('users.id');	
    	table.foreign('buyer_id').references('users.id');	
    	table.foreign('jeweltype_id').references('jeweltype.id');	

    }),

    knex.schema.createTable('diamondlog', function(table){
    	table.increments('id');
    	table.integer('user_id').unsigned().notNull();
    	table.integer('count').notNull();    	
    	table.timestamp('created_at').defaultTo(knex.fn.now());
    	table.string('logtext').notNull();

    	table.foreign('user_id').references('users.id');
    }),

    knex.schema.createTable('coinlog', function(table){
    	table.increments('id');
    	table.integer('user_id').unsigned().notNull();
    	table.integer('count').notNull();    	
    	table.timestamp('created_at').defaultTo(knex.fn.now());
    	table.string('logtext').notNull();

    	table.foreign('user_id').references('users.id');
    }),

    knex.schema.createTable('pointlog', function(table){
    	table.increments('id');
    	table.integer('user_id').unsigned().notNull();
    	table.integer('count').notNull();    	
    	table.timestamp('created_at').defaultTo(knex.fn.now());
    	table.string('logtext').notNull();

    	table.foreign('user_id').references('users.id');
    })

  ])
};

exports.down = function(knex, Promise) {  
  return Promise.all([
    knex.schema.dropTableIfExists('users'),
    knex.schema.dropTableIfExists('scores'),
    knex.schema.dropTableIfExists('jeweltype'),
    knex.schema.dropTableIfExists('jewels'),
    knex.schema.dropTableIfExists('taskdetails'),
    knex.schema.dropTableIfExists('taskusers'),
    knex.schema.dropTableIfExists('achievements'),
    knex.schema.dropTableIfExists('achievementusers'),
    knex.schema.dropTableIfExists('factory'),
    knex.schema.dropTableIfExists('factorymaterial'),
    knex.schema.dropTableIfExists('factoryuser'),
    knex.schema.dropTableIfExists('factorylogs'),
    knex.schema.dropTableIfExists('market'), 
    knex.schema.dropTableIfExists('diamondlog'), 
    knex.schema.dropTableIfExists('coinlog'), 
    knex.schema.dropTableIfExists('pointlog')

  ])
};