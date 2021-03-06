'use strict';

exports.up = function(knex, Promise) {  

  return knex.schema.createTable('jcusers', function(table){
      table.increments('id');      
      table.bigInteger('phone').unsigned().notNull();
      table.string('vcode').nullable(); 
      table.string('scode').nullable();      
      table.string('name').nullable();
      table.string('status', 1000).nullable().collate('utf8mb4_unicode_ci');
      table.text('pic', 'longtext' ).nullable();
      table.string('large_pic').nullable();
      table.bigInteger('reference').unsigned().nullable();      
      table.string('push_service').nullable();
      table.string('device_id').nullable();      
      table.boolean('active').defaultTo(false);
      table.boolean('initialized').defaultTo(false);
      table.boolean('is_rooted').nullable();   
      table.boolean('jewel_block').nullable();      
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());      
      table.integer('teamjc_id').unsigned().nullable();
      table.string('teamjc_phone').nullable();
      
      table.unique(['phone']);
      
      table.index(['reference']);

      table.charset('utf8mb4');
      table.collate('utf8mb4_unicode_ci');
      

    })
  .then(() => {
    return knex.schema.createTable('invite', function(table){
      table.increments('id');
      table.integer('user_id').unsigned().notNull();      
      table.bigInteger('invitee').unsigned().notNull();
      table.index(['invitee']);  

      table.unique([ 'user_id', 'invitee' ]);

    })
  })
  .then(() => {
    return knex.schema.createTable('blocked', function(table){
      table.increments('id');
      table.integer('user_id').unsigned().notNull();     
      table.integer('blocked_user_id').unsigned().notNull(); 
      table.index(['user_id']);  

      table.foreign('user_id').references('jcusers.id');
    })
  })  
  .then(() => {
    return knex.schema.createTable('jeweltype', function(table){
      table.integer('id').unsigned().notNull().primary();
      table.string('name').notNull();
      table.integer('min_cost').notNull();      
    })
  })
  .then(() => {
    return knex.schema.createTable('groups', function(table){
      table.increments('id');           
      table.string('small').nullable();
      table.string('large').nullable();
      table.string('name').notNull();
      table.string('status', 1000).nullable();      
    })
  })
  .then(() => {
    return knex.schema.createTable('groupmembers', function(table){
      table.increments('id');
      table.integer('user_id').unsigned().notNull(); 
      table.integer('group_id').unsigned().notNull();   
      table.boolean('is_admin').defaultTo(false);
      table.index(['group_id']);
      table.foreign('user_id').references('jcusers.id');
      table.foreign('group_id').references('groups.id');
    })
  })
  .then(() => {
    return knex.schema.createTable('chats', function(table){
      table.increments('id');
      table.integer('sender_id').unsigned().notNull(); 
      table.integer('sender_msgid').notNull();
      table.string('name').nullable(); 
      table.bigInteger('sender_phone').unsigned().nullable();
      table.integer('receiver_id').unsigned().nullable(); 
      table.string('eventname').notNull();         
      table.text('msg', 'longtext').nullable().collate('utf8mb4_unicode_ci'); 
      table.string('path').nullable();
      table.text('blob', 'longtext').nullable(); 
      table.integer('type').nullable();
      table.integer('jeweltype_id').unsigned().nullable();
      table.integer('chat_id').unsigned().nullable();      
      table.bigInteger('created_at').unsigned().notNull();      

      //table.index([ 'sender_id' ]);
      table.index([ 'receiver_id' ]);
      table.index([ 'receiver_id', 'created_at' ]);
      
      table.foreign('sender_id').references('jcusers.id');
      table.foreign('receiver_id').references('jcusers.id');      
      table.foreign('jeweltype_id').references('jeweltype.id');

      table.charset('utf8mb4');
      table.collate('utf8mb4_unicode_ci');

    })
  })
  .then(() => {
    return knex.schema.createTable('groupchats', function(table){
      table.increments('id');
      table.integer('sender_id').unsigned().notNull();
      table.integer('sender_msgid').notNull(); 
      table.string('name').nullable(); 
      table.bigInteger('sender_phone').unsigned().nullable();       
      table.integer('group_id').unsigned().nullable();  
      table.string('eventname').notNull();     
      table.text('msg', 'longtext').nullable().collate('utf8mb4_unicode_ci'); 
      table.string('path').nullable();  
      table.text('blob', 'longtext').nullable();    
      table.integer('type').nullable();      
      table.integer('jeweltype_id').unsigned().nullable();  
      table.integer('chat_id').unsigned().nullable();    
      table.bigInteger('created_at').notNull();

      //table.index([ 'sender_id' ]);      
      table.index([ 'group_id' ]);
      table.index([ 'group_id', 'created_at' ]);
      table.foreign('sender_id').references('jcusers.id');      
      table.foreign('group_id').references('groups.id');
      table.foreign('jeweltype_id').references('jeweltype.id');

      table.charset('utf8mb4');
      table.collate('utf8mb4_unicode_ci');
      
    })
  })  
  .then(() => {
    return knex.schema.createTable('scores', function(table){
      table.increments('id');
      table.integer('user_id').unsigned().notNull();      
      table.integer('level').defaultTo(1).notNull();
      table.integer('points').defaultTo(5).notNull();
      table.integer('max_level_points').defaultTo(55).notNull();      
      table.integer('storesize').defaultTo(25).notNull();
      table.index(['user_id']);
      table.foreign('user_id').references('jcusers.id');
    })
  })
  .then(() => {
    return knex.schema.createTable('jewels', function(table){
      table.increments('id');
      table.integer('user_id').unsigned().notNull();    
      table.integer('jeweltype_id').unsigned().notNull();     
      table.integer('count').defaultTo(0);
      table.integer('total_count').defaultTo(0);
      table.timestamp('updated_at').defaultTo(knex.fn.now());

      table.index(['user_id']);
      table.foreign('user_id').references('jcusers.id');

      table.foreign('jeweltype_id').references('jeweltype.id');          
    })
  })
  .then(() => {
    return knex.schema.createTable('tasks', function(table){
      table.increments('id');
      table.timestamp('duration').nullable();
      table.integer('coins').nullable();
      table.integer('points').notNull();
      table.decimal('money', [5], [2] ).defaultTo(0.00).nullable();      
      table.integer('qty').nullable();
      table.timestamp('created_at').defaultTo(knex.fn.now());       
    })
  })
  .then(() => {
    return knex.schema.createTable('taskdetails', function(table){
      table.increments('id');
      table.integer('task_id').unsigned().notNull();
      table.integer('jeweltype_id').unsigned().notNull();
      table.integer('count').notNull();      
      table.index(['task_id']);
      table.foreign('task_id').references('tasks.id');
      table.foreign('jeweltype_id').references('jeweltype.id');       
    })
  })
  .then(() => {
    return knex.schema.createTable('taskusers', function(table){
      table.increments('id');
      table.integer('task_id').unsigned().notNull();
      table.integer('user_id').unsigned().notNull();
      table.boolean('show_money').defaultTo(true);
      table.integer('level').defaultTo(0);
      table.boolean('done').defaultTo(false);
      table.index(['user_id']);
      table.index(['task_id']);
      table.foreign('task_id').references('tasks.id');
      table.foreign('user_id').references('jcusers.id');      
    })
  })  
  .then(() => {
    return knex.schema.createTable('achievements', function(table){
      table.integer('id').unsigned().notNull().primary();
      table.integer('diamond').notNull();
      table.string('text').notNull();
      table.string('note').nullable();           
    })
  })
  .then(() => {
    return knex.schema.createTable('achievementusers', function(table){
      table.increments('id');
      table.integer('achievement_id').unsigned().notNull();
      table.integer('user_id').unsigned().notNull();
      table.integer('level').defaultTo(2); 
      
      table.index(['achievement_id']);
      table.foreign('achievement_id').references('achievements.id');      
    })
  })
  .then(() => {
    return knex.schema.createTable('factory', function(table){
      table.increments('id');
      table.integer('jeweltype_id').unsigned().notNull();
      table.integer('count').notNull();
      table.integer('level').notNull();
      table.integer('diamond').notNull(); 
      table.integer('duration').notNull();

      table.foreign('jeweltype_id').references('jeweltype.id'); 
          
    })
  })
  .then(() => {
    return knex.schema.createTable('factorymaterial', function(table){
      table.increments('id');
      table.integer('factory_id').unsigned().notNull();
      table.integer('jeweltype_id').unsigned().notNull();
      table.integer('count').notNull(); 

      table.index(['factory_id']);
      
      table.foreign('factory_id').references('factory.id'); 
      table.foreign('jeweltype_id').references('jeweltype.id');     
    })
  })
  .then(() => {
    return knex.schema.createTable('factoryuser', function(table){
      table.increments('id');
      table.integer('factory_id').unsigned().notNull();
      table.integer('user_id').unsigned().notNull();      
      table.timestamp('start_time').nullable();
      table.boolean('is_on').defaultTo(false);

      table.index(['factory_id']);
      table.index(['user_id']);
      table.foreign('factory_id').references('factory.id'); 
      table.foreign('user_id').references('jcusers.id');      
    })
  })
  .then(() => {
    return knex.schema.createTable('factorylogs', function(table){
      table.increments('id');
      table.integer('factory_id').unsigned().notNull();
      table.integer('user_id').unsigned().notNull(); 
      table.timestamp('start_time').nullable();    
      table.timestamp('end_time').nullable();
      table.boolean('diamond_used').defaultTo(false); 

      table.foreign('factory_id').references('factory.id'); 
      table.foreign('user_id').references('jcusers.id');      
    })
  })
  .then(() => {
    return knex.schema.createTable('market', function(table){
      table.increments('id');
      table.integer('seller_id').unsigned().notNull();
      table.integer('buyer_id').unsigned().notNull();
      table.integer('cost').notNull();
      table.integer('count').notNull();
      table.integer('jeweltype_id').unsigned().notNull();
      table.boolean('done').defaultTo(false);

      table.index(['seller_id']);
      table.index(['buyer_id']);

      table.foreign('seller_id').references('jcusers.id');  
      table.foreign('buyer_id').references('jcusers.id'); 
      table.foreign('jeweltype_id').references('jeweltype.id'); 

    })
  })
  .then(() => {
    return knex.schema.createTable('wallet', function(table){
      table.increments('id');
      table.integer('user_id').unsigned().notNull();
      table.decimal('money', [15], [2]).defaultTo(0.00).notNull();
      table.index(['user_id']);
      
      table.foreign('user_id').references('jcusers.id');  
    })
  })
  .then(() => {
    return knex.schema.createTable('moneytogive', function(table){
      table.increments('id');
      table.integer('user_id').unsigned().notNull();
      table.decimal('money', [15], [2]).defaultTo(0.00).notNull();
      table.index(['user_id']);
      
      table.foreign('user_id').references('jcusers.id');     
    })
  })
  .then(() => {
    return knex.schema.createTable('prize', function(table){
      table.decimal('money', [15], [2]).defaultTo(0.00).notNull();     
    })
  })
  .then(() => {
    return knex.schema.createTable('walletlog', function(table){
      table.increments('id');
      table.integer('user_id').unsigned().notNull();
      table.decimal('money', [15], [2]).defaultTo(0.00).notNull();
      table.string('tag').notNull();
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.index(['user_id']);

      table.foreign('user_id').references('jcusers.id');
    })
  })
  .then(() => {
    return knex.schema.createTable('diamondlog', function(table){
      table.increments('id');
      table.integer('user_id').unsigned().notNull();
      table.integer('count').notNull();     
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.string('logtext').notNull();
      table.index(['user_id']);

      table.foreign('user_id').references('jcusers.id');
    })
  })
  .then(() => {
    return knex.schema.createTable('coinlog', function(table){
      table.increments('id');
      table.integer('user_id').unsigned().notNull();
      table.integer('count').notNull();     
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.string('logtext').notNull();
      table.index(['user_id']);

      table.foreign('user_id').references('jcusers.id');
    })
  })
  .then(() => {
    return knex.schema.createTable('pointlog', function(table){
      table.increments('id');
      table.integer('user_id').unsigned().notNull();
      table.integer('count').notNull();     
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.string('logtext').notNull();
      table.index(['user_id']);

      table.foreign('user_id').references('jcusers.id');
    })
  })
  .then(() => {
    return knex.schema.createTable('money', function(table){
      
      table.decimal('money', [15], [2]).defaultTo(0.00).notNull();

    })
  })


};

exports.down = function(knex, Promise) {  
  return Promise.all([
    knex.schema.dropTableIfExists('jcusers'),
    knex.schema.dropTableIfExists('invite'),
    knex.schema.dropTableIfExists('blocked'),    
    knex.schema.dropTableIfExists('groups'),
    knex.schema.dropTableIfExists('groupmembers'),
    knex.schema.dropTableIfExists('chats'),
    knex.schema.dropTableIfExists('groupchats'),
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
    knex.schema.dropTableIfExists('wallet'),
    knex.schema.dropTableIfExists('moneytogive'),
    knex.schema.dropTableIfExists('prize'),
    knex.schema.dropTableIfExists('diamondlog'), 
    knex.schema.dropTableIfExists('coinlog'), 
    knex.schema.dropTableIfExists('pointlog')
  ])
};

