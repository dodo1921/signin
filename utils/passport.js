'use strict';

let knex = require('../db/knex');
let memcached = require('./memcache');


module.exports = {

	authenticate: function(req, userId, verificationCode, done){

		knex('users').where({id: userId})
		.select()
		.then( user => {
			if(user[0].vcode === verificationCode){

				knex('users').where({id:user[0].id}).update({sessionId: req.session.id, active: true })
				.then( () => {
					user[0].sessionId = req.session.id;
					memcached.set( req.session.id, user[0], 300, err =>{} );									
					done(null, user[0] );
				})
				.catch( err => {
					done( err , null);
				})
				
			}
			else{
				let err = new Error('Verification code does not match');
  				err.status = 403;
				done( err, null );
			}
		})
		.catch( err => {
			done( err , null);
		})	


		
	},

	serializeUser: function(user, done){

		console.log('Serialize:::'+user);
		//done(null, session);
		done(null, user.id);

	},

	deserializeUser: function(id, done){

		console.log('Deserialize:::::'+id);
		done(null, id);
		/*

		knex('users').where({id})
		.select()
		.then( user => {
			done(null, user[0] )
		})
		.catch( err => {
			done( err , null);
		})
		
		*/
		

	},


	isAuthenticated: function(req, res, next){

		if (req.isAuthenticated()){ 
		    //console.log('OMGOMGOMG:::ISAuthenticated');
		    return next();

		}else{      
		        
		  return res.status(403).json({ success: false, data: 'Auth Error'});
		        
		}

	}


};
