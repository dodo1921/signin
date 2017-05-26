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
  
  	knex.transaction( trx => {      

  				knex.returning('id').insert(groupdetails).into('groups').transacting(trx)
  				.then( group_id => {

  						return Promise.map(grmembers, function(user) {
							        
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
      res.json({error: false, group_id: group_id[0] });
    })
    .catch( err => {
      // If we get here, that means that neither the 'Old Books' catalogues insert,
      // nor any of the books inserts will have taken place.
      next(err)
    });
	

};

groups.updateGroupStatus= function(req, res, next) {
  
	

};

groups.updateGroupPic= function(req, res, next) {
  
	

};

groups.addNewMembers= function(req, res, next) {
  
	

};

groups.leaveGroup= function(req, res, next) {
  
	

};

