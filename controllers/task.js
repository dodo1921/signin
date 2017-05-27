'use strict'

let knex = require('../db/knex');
let Promise = require('bluebird');

let task = module.exports;


task.getTasks = function(req, res, next) {
  
	knex('taskusers').where({ user_id: req.user.id , done : false })
  	.join('tasks', 'taskusers.task_id', '=', 'tasks.id')
  	//.join('taskdetails', 'taskusers.task_id', '=', 'taskdetails.task_id' )
  	.orderBy('taskusers.id', 'asc').
  	.select()
  	.limit(8).offset(req.body.page * 8)
  	.then(tasks => {
  		if(tasks.length >= 8)
  			res.json({error: false, tasks, page: (req.body.page+1) });
  		else
  			res.json({error: false, tasks});	
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
  
	

};

task.redeemAchivement= function(req, res, next) {
  
	

};


