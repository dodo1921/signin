'use strict'

let knex = require('../db/knex');

let Promise = require('bluebird');

let groups = module.exports;



groups.getGroups= function(req, res, next) {

	knex('groupmembers').where({ user_id: req.user.id }).join('groups', 'groups.id', '=', 'groupmembers.group_id')
	.select('groups.id', 'groups.name', 'groups.status', 'groups.small', 'groups.large')
	.then(groups => {
		res.json({error: false, groups })
	})
	.catch(err => {
		next(err);
	});
  
	

};


groups.createGroups= function(req, res, next) {
  
	

};

groups.addNewMembers= function(req, res, next) {
  
	

};

groups.leaveGroup= function(req, res, next) {
  
	

};

