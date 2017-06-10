'use strict'

let knex = require('../db/knex');
let Promise = require('bluebird');

let task = module.exports;


task.getTasks = function(req, res, next) {

  var subquery = knex('taskusers')
                 .where({ user_id: req.session.user.id , done : false })
                 .orderBy('taskusers.id', 'desc')
                 .select('task_id')
                 .limit(5).offset(req.body.page * 5);
  
	knex('taskusers').whereIn('taskusers.task_id', subquery)
	.join('tasks', 'taskusers.task_id', '=', 'tasks.id')
	.join('taskdetails', 'taskusers.task_id', '=', 'taskdetails.task_id' )  	
	.select('tasks.id as id', 'tasks.duration as duration', 'tasks.coins as coins', 'tasks.points as points'
    , 'tasks.money as money', 'tasks.level as level', 'tasks.created_at as created_at'
    , 'taskdetails.jeweltype_id as jeweltype_id', 'taskdetails.count as count', 'taskusers.done as done' )
  .groupBy('tasks.id')    	
	.then(tasks => {  		
			return res.json({error: false, tasks });  			
	})
	.catch(err => {
		next(err);
	});

};

task.getTaskElements= function(req, res, next) {
  
	knex('taskdetails').where({task_id: req.body.task_id})
	.select()
	.then(tasks => {  		
  		res.json({error: false, taskdetails});	
  	})
  	.catch(err => {
  		next(err);
  	});

};

task.redeemTask= function(req, res, next) {
  
	

};

task.getAchievements= function(req, res, next) {
  
	knex('achievementusers').where({ user_id: req.user.id })
  	.join('achievements', 'achievementusers.achievement_id', '=', 'achievements.id')
  	//.join('taskdetails', 'taskusers.task_id', '=', 'taskdetails.task_id' )
  	.orderBy('achievementusers.level', 'asc')
  	.select()
  	.limit(8).offset(req.body.page * 8)
  	.then(achievements => {
  		if(achievements.length >= 8)
  			res.json({error: false, achievements, page: (req.body.page+1) });
  		else
  			res.json({error: false, achievements});	
  	})
  	.catch(err => {
  		next(err);
  	});

};

task.redeemAchievement= function(req, res, next) {
  
	

};


