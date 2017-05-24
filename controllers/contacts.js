'use strict'

let knex = require('../db/knex');

let Promise = require('bluebird');

let contacts = module.exports;


contacts.getRegisteredContacts= function(req, res, next) {
  
	  let phoneNumberList = req.body.phoneNumberList;
	  knex('users')
	  .whereIn( 'phone', phoneNumberList )
	  .select( 'phone', 'id', 'pic')
	  .then(users => {
	  	res.json({ error:false, users});
	  })
	  .catch(err => {
	  	next(err);
	  });
	

};

contacts.getProfile= function(req, res, next) {

		Promise.all([
				knex('users').where({id: req.user.id }).join('scores', 'users.id', '=', 'scores.user_id')
				.select('users.id', 'users.name', 'scores.level'),
				knex('pics').where({user_id: req.user.id}).select()
		])
		.then(values => {
				res.json({ error:false, user: values[0][0], pics: values[1] });
		})
		.catch(err => {
				next(err)
		});

};


contacts.getUserProfile= function(req, res, next) {
  
		Promise.all([
				knex('users').where({id: req.body.user_id }).join('scores', 'users.id', '=', 'scores.user_id')
				.select('users.id', 'users.name', 'scores.level'),
				knex('pics').where({user_id: req.body.user_id }).select()
		])
		.then(values => {
				res.json({ error:false, user: values[0][0], pics: values[1] });
		})
		.catch(err => {
				next(err)
		});

};

contacts.addPic= function(req, res, next) {
  
	knex.returning('id').table('pic').insert({ user_id: req.user.id, small: req.body.small, large: req.body.large})
	.then( id => {
		res.json({ error:false, pic_id: id });
	})
	.catch( err => {
		next(err);
	});

};

contacts.updateProfilePic= function(req, res, next) {
  
  Promise.all([
  	knex('users').where({id: req.user.id}).update({ pic:req.body.pic }),
  	knex('pic').where({id: req.body.pic_id_old}).update({ is_profile: false}),
  	knex('pic').where({id: req.body.pic_id_new}).update({ is_profile: true}),
  ])	
	.then((values)=>{
		res.json({ error: false });
	})
	.catch( err => {
		next(err);
	});

};

contacts.updateProfileStatus= function(req, res, next) {
  
	knex('users').where({id: req.user.id}).update({ status:req.body.status })
	.then(()=>{
		res.json({ error: false });
	})
	.catch( err => {
		next(err);
	});

};
