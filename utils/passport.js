'use strict';

let knex = require('../db/knex');

module.exports = {

	authenticate: function(req, userId, verificationCode, done){

		knex('users').where({id: userId})
		.select()
		.then( user => {
			if(user[0].vcode === verificationCode)
				done(null, user[0] );
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

	deserializeUser: function(session, done){

		console.log('Deserialize:::::'+session);
		done(null, session);
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
		        
		  res.status(403).json({ success: false, data: 'Auth Error'});
		        
		}

	}


};
