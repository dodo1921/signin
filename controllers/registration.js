'use strict'

let knex = require('../db/knex');
let speakeasy = require('speakeasy');
let request = require('request');
let passport = require('passport');

let signature = require('cookie-signature');

let cookie = require('cookie');


let registration = module.exports;


registration.registerPhoneNumber = function(req, res, next) {

	let phone = req.body.phone;

	knex('users').where({phone}).select()
	.then( user =>{

		if( user.length>0 ){	

					//send sms vcode

					let se = speakeasy.totp({key: 'secret'});

					knex('users').where({phone}).update({vcode:se})
					.then(()=>{

								/*

								let sms = 'CitiTalk verification PIN '+se;
								let encoded_sms = encodeURI(sms);
								
								let req_string = 'http://enterprise.smsgupshup.com/GatewayAPI/rest?method=SendMessage&send_to='+user[0].phone+'&msg='+encoded_sms+'&msg_type=TEXT&userid=2000152880&auth_scheme=plain&password=qwerty123&v=1.1&format=text'
								request(req_string, function (error, response, body) {
									if(error) {
										console.log('SMS GUPSHUP error:::'+ user[0].phone+ '::' + se);								
									}
								  if (!error && response.statusCode == 200) {
								    
								  }
								});

								*/

								/*
								setTimeout(function(){
									//set vcode to null
									knex('users').where({phone}).update({vcode:null})

								}, 600000);
								*/

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
			let se = speakeasy.totp({key: 'secret'});
			knex.returning('id').table('users').insert({ phone, vcode:se })
			.then(id => {
				//send sms vcode	

					
								/*

								let sms = 'CitiTalk verification PIN '+se;
								let encoded_sms = encodeURI(sms);
								
								let req_string = 'http://enterprise.smsgupshup.com/GatewayAPI/rest?method=SendMessage&send_to='+phone+'&msg='+encoded_sms+'&msg_type=TEXT&userid=2000152880&auth_scheme=plain&password=qwerty123&v=1.1&format=text'
								request(req_string, function (error, response, body) {
									if(error) {
										console.log('SMS GUPSHUP error:::'+ user[0].phone+ '::' + se);								
									}
								  if (!error && response.statusCode == 200) {
								    
								  }
								});
								*/
								/*
								setTimeout(function(){
									//set vcode to null
									knex('users').where({phone}).update({vcode:null});

								}, 600000);

								*/
								
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
            	
  					return res.json({ error : false });	
					
						



            //return res.json({ error : false });
             
        });
		    
    })(req, res, next);  
	

};

registration.checkValidReference= function(req, res, next) {	
			

		knex('users').where({id: req.body.reference}).select()
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
		if(req.body.reference)
			upd.reference = req.body.reference;

		knex('users').where({id: req.user.id}).update(upd)
		.then(()=>{
				res.json({ error: false });
		})
		.catch( err =>{
			next(err);
		});	

};

registration.resendVcode= function(req, res, next) {


  	let phone = req.user.phone;

  	let se = speakeasy.totp({key: 'secret'});

		knex('users').where({phone}).update({vcode:se})
		.then(()=>{

					let sms = 'CitiTalk verification PIN '+se;
					let encoded_sms = encodeURI(sms);
					
					let req_string = 'http://enterprise.smsgupshup.com/GatewayAPI/rest?method=SendMessage&send_to='+phone+'&msg='+encoded_sms+'&msg_type=TEXT&userid=2000152880&auth_scheme=plain&password=qwerty123&v=1.1&format=text'
					request(req_string, function (error, response, body) {

							if(error) {
								console.log('SMS GUPSHUP error:::'+ phone + '::' + se);								
							}
						  if (!error && response.statusCode == 200) {
						    
						  }

					});

					/*
					setTimeout(function(){
						//set vcode to null
						knex('users').where({phone}).update({vcode:null});

					}, 600000);

					*/
					
					res.json({ error: false });

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


 