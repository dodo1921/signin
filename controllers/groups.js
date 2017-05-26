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

		let groupdetails = {};
		groupdetails.name  = req.body.name;

		if(req.body.status)
			groupdetails.status = req.body.status;

		if(req.body.small && req.body.large){
			groupdetails.small = req.body.small;
			groupdetails.large = req.body.large;
		}

		let grmembers = req.body.grmembers;

		let gr;
  
  	knex.transaction( trx => {      

  				knex.returning('id').insert(groupdetails).into('groups').transacting(trx)
  				.then( group_id => {
  						gr = group_id[0];
  						return Promise.map(grmembers, user=>{
							        
							        user.group_id = group_id[0];

							        // Some validation could take place here.

							        return knex.insert(user).into('groupmembers').transacting(trx);
							      });

  				})
                  
          .then(trx.commit)
          .catch(trx.rollback);

    })
    .then( values => {
    	//send gcm messages to other group 
      res.json({error: false, group_id: gr });
    })
    .catch( err => {
      // If we get here, that means that neither the 'Old Books' catalogues insert,
      // nor any of the books inserts will have taken place.
      next(err)
    });
	

};

groups.updateGroupStatus= function(req, res, next) {

		knex('groups').where({id: req.body.group_id}).update({status: req.body.status })
		.then(()=>{
			res.json({error: false});
		})
		.catch(err=>{
			next(err);
		});	

};

groups.updateGroupPic= function(req, res, next) {
  
  	knex('groups').where({id: req.body.group_id}).update({small: req.body.small, large: req.body.large })
		.then(()=>{
			res.json({error: false});
		})
		.catch(err=>{
			next(err);
		});
	

};

groups.listGroupMemebers= function(req, res, next) {
  
  	knex('groupmembers').where({id: req.body.group_id}).join('users', 'users.id', '=', 'groupmembers.user_id')
  	.select('users.id', 'users.small', 'groupmembers.is_admin', 'users.name' )
		.then((members)=>{
			res.json({error: false, members });
		})
		.catch(err=>{
			next(err);
		});
	

};

groups.addNewMembers= function(req, res, next) {
  	
		let newmember = {};

		newmember.group_id = req.body.group_id;
		newmember.user_id = req.body.user_id;
		newmember.is_admin = req.body.is_admin;


		knex('groupmembers').where({ group_id: req.body.group_id}).count()
		.then(count => {

			if(count[0]>=40){

				res.json({error:false, msg: 'Max group member reached'});

			}else{	

		 		return knex('groupmembers')
		 		.where({user_id: req.user.id, group_id: req.body.group_id})
		 		.select('is_admin')
			}
		})
		.then( is_admin => {
				if(is_admin[0]){
					//send firebase msg
					return knex.insert(newmember).into('groupmembers')				
				}
				else{
					res.json({error:false, msg: 'Not an admin'});
				}
		})
		.then( () => {
							
							res.json({error:false});
							
		})
		.catch(err => {
			next(err);
		});

		

};

groups.leaveGroup= function(req, res, next) {
  
	

};

