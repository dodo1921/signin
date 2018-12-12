'use strict'

let knex = require('../db/knex');

let Promise = require('bluebird');

let contacts = module.exports;


contacts.getRegisteredContacts= function(req, res, next) {
  
	  let phoneNumberList = req.body.phoneNumberList;
	  knex('jcusers')
	  .whereIn( 'phone', phoneNumberList )
	  .select( 'phone', 'id', 'pic')
	  .then(jcusers => {
	  	res.json({ error:false, jcusers});
	  })
	  .catch(err => {
	  	next(err);
	  });
	

};


contacts.downloadContact= function(req, res, next) {
  
	  
	  knex('jcusers')
	  .where( 'id', req.body.id )
	  .select( 'id', 'pic', 'name', 'phone', 'status' )
	  .then(jcusers => {
	  	return res.json({ error:false, contact: jcusers[0] });
	  })
	  .catch(err => {
	  	next(err);
	  });
	

};

contacts.downloadContact_Phone= function(req, res, next) {
  
	  
	  knex('jcusers')
	  .where( 'phone', req.body.phone )
	  .select( 'id', 'pic', 'name', 'phone', 'status' )
	  .then(jcusers => {
	  	if(jcusers.length>0)
	  		return res.json({ error:false, contact: jcusers[0] });
	  	else{
	  		let c = {};
	  		return res.json({ error:false});
	  	}
	  })
	  .catch(err => {
	  	next(err);
	  });
	

};

contacts.getProfile= function(req, res, next) {

		Promise.all([
				knex('jcusers').where({id: req.user.id }).join('scores', 'jcusers.id', '=', 'scores.user_id')
				.select('jcusers.id', 'jcusers.name', 'scores.level'),
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
				knex('jcusers').where({id: req.body.user_id }).join('scores', 'jcusers.id', '=', 'scores.user_id')
				.select('jcusers.id', 'jcusers.name', 'scores.level'),
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

contacts.updateProfilePic = function(req, res, next) {  
  	
  	knex('jcusers').where({id: req.session.user.id}).update({ pic:req.body.pic })
	.then((values)=>{
		res.json({ error: false });
	})
	.catch( err => {
		next(err);
	});

};

contacts.updateProfileStatus = function(req, res, next) {
  
	knex('jcusers').where({ id: req.session.user.id }).update({ status: req.body.status })
	.then(()=>{
		res.json({ error: false });
	})
	.catch( err => {
		next(err);
	});

};


contacts.updateProfileName = function(req, res, next) {
  
	knex('jcusers').where({ id: req.session.user.id }).update({ name: req.body.name })
	.then(()=>{
		res.json({ error: false });
	})
	.catch( err => {
		next(err);
	});

};
