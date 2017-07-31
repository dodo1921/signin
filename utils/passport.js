'use strict';

let knex = require('../db/knex');
let memcached = require('./memcache');

let speakeasy = require('speakeasy');


module.exports = {

	authenticate: function(req, userId, verificationCode, done){

		knex('users').where({id: userId})
		.select( 'id', 'vcode', 'scode', 'online', 'topic', 'token_google', 'is_rooted', 'jewel_block', 'initialized', 'teamjc_id', 'teamjc_phone', 'active' )
		.then( user => {
			if(user[0].vcode === verificationCode){

				//memcached.del(user[0].sessionId, err=>{});
				let se = speakeasy.totp({secret: 'secret',  encoding: 'base32'});
				knex('users').where({id:user[0].id}).update({ active: true, scode: se })
				.then( () => {		
					user[0].scode = se;							
					memcached.set( user[0].id, user[0], 300, err =>{} );
					user[0].active = 1;		
					console.log('>>>>>>>>>>>>>>>>>');							
					done( null, user[0] );
				})
				.catch( err => {
					done( err , null );
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
		done(null, user);

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
