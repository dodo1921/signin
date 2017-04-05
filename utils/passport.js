'use strict'

module.exports = {

	authenticate: function(req, userId, verificationCode, done){

		return done(null, { id:1, name: 'Mayukh', phone: 919005835708 } );
	},

	serializeUser: function(user, done){

		done(null, 1 );

	},

	deserializeUser: function(id, done){

		done(null, { id:1, name: 'Mayukh', phone: 919005835708 } )

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
