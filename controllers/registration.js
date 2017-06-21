'use strict'

let knex = require('../db/knex');
let speakeasy = require('speakeasy');
let request = require('request');
let passport = require('passport');

let signature = require('cookie-signature');

let cookie = require('cookie');

let initializeGame = require('../utils/initializeGame');


let registration = module.exports;


registration.registerPhoneNumber = function(req, res, next) {

	let phone = req.body.phone;
	console.log('>>>>'+phone);
	knex('users').where({phone}).select()
	.then( user =>{

		if( user.length>0 ){	

					//send sms vcode

					let se = speakeasy.totp({secret: 'secret',  encoding: 'base32'});;

					knex('users').where({phone}).update({vcode:se})
					.then(()=>{								

								if( user[0].active ){		
										
										return res.json({ error: false, userId: user[0].id, active: true });

								}else{
										
										return res.json({ error: false, userId: user[0].id, active: false });
								}


					})
					.catch( err =>{
						next(err);
					});		

			
			
		}else{

					//insert new user
					let se = speakeasy.totp({secret: 'secret',  encoding: 'base32'});
					knex.returning('id').table('users').insert({ phone, vcode:se, name: 'defaultJCUname' })
					.then(id => {								
										
										return res.json({ error: false, userId: id[0], active: false });
						
					})
					.catch( err => {
						next(err);
					});			


		}

	})
	.catch( err =>{
		next(err);
	});
  
	

};

registration.verifyCode= function(req, res, next) {

			passport.authenticate('local', (err, user, info) => {
        if (err) next(err);
        //console.log(JSON.stringify(user));
        req.logIn(user, function(err) {      
            if (err) next(err);

            let t = new Date(); 
            
            if(!user.initialized)
            	initializeGame(user.id);
            //initial jewels
            //initial scores
            //create factories
            //create tasks
            //create achivements


            //console.log(JSON.stringify(req.session));
            
            
            var signed = 's:' + signature.sign( user.id + '::::' + user.scode , 'ilovescotchscotchyscotchscotch');
					  var data = cookie.serialize('connect.sid', signed, {});  

					  var prev = res.getHeader('jc-cookie') || [];
					  var header = Array.isArray(prev) ? prev.concat(data) : [prev, data];		

					  res.setHeader('jc-cookie', header);

  					return res.json({ error : false, request : 'verifyCode', created_at: t.getTime() });

            //return res.json({ error : false });
             
        });
		    
    })(req, res, next);  
	

};

registration.checkValidReference= function(req, res, next) {	
			

		knex('users').where({ phone: req.body.reference}).select()
		.then( user=>{
				if(user.length>0)
					res.json({ error: false, is_valid: true  });
				else
					res.json({ error: false, is_valid: false });
		})
		.catch( err =>{
			next(err);
		});	

};


registration.initialDetails= function(req, res, next) {
	

		let upd = {};
		upd.name = req.body.name;
		if(req.body.reference){
			if(req.session.user.phone !== parseInt(req.body.reference))
				upd.reference = req.body.reference;
		}

		knex('users').where({id: req.session.user.id}).update(upd)
		.then(()=>{
				res.json({ error: false, name: req.body.name });
		})
		.catch( err =>{
			next(err);
		});	

};

registration.resendVcode= function(req, res, next) {


  	let id = req.body.userId;

  	console.log('Resendvcode>>'+id);

  	let se = speakeasy.totp({secret: 'secret',  encoding: 'base32'});;

		knex('users').where({id}).update({vcode:se})
		.then(()=>{

					

					/*
					setTimeout(function(){
						//set vcode to null
						knex('users').where({phone}).update({vcode:null});

					}, 600000);

					*/
					
					res.json({ error: false, request: 'resendVcode' });

		})
		.catch( err =>{
			next(err);
		});	
	

};

registration.inviteUser= function(req, res, next) { 
	

};

registration.updateGcmToken= function(req, res, next) {
  
		let token = req.body.token;
		  	

		knex('users').where({id: req.user.id}).update({ token_google:token })
		.then(()=>{
			res.json({ error: false });
		})
		.catch( err => {
			next(err);
		});


};

registration.getChildren= function(req, res, next) {
  
	  knex('users')
	  .where({reference: req.user.phone })
	  .join('scores', 'users.id', '=', 'scores.user_id')
	  .select('users.id', 'users.name', 'scores.level')
		.then( users =>{
			res.json({ children: users });
		})
		.catch(err=>{
			next(err);
		});

};


 