'use strict'

let knex = require('../db/knex');
let speakeasy = require('speakeasy');
let request = require('request');
let passport = require('passport');

let signature = require('cookie-signature');

let cookie = require('cookie');

let initializeGame = require('../utils/initializeGame');

let game = require('./game');

let admin = require('firebase-admin');


let registration = module.exports;


registration.registerPhoneNumber = function(req, res, next) {

	let phone = req.body.phone;
	console.log('>>>>'+phone);
	knex('users').where({phone}).select()
	.then( user =>{

		if( user.length>0 ){	

					//send sms vcode

					let se = speakeasy.totp({secret: 'secret',  encoding: 'base32'});					

					knex('users').where({phone}).update({vcode:se})
					.then(()=>{								

								if( user[0].active ){		
										
										return res.json({ error: false, userId: user[0].id, active: true, name: user[0].name, status_msg: user[0].status , app_version : game.app_version });

								}else{
										
										return res.json({ error: false, userId: user[0].id, active: false, name: user[0].name, status_msg: user[0].status, app_version : game.app_version });
								}


					})
					.catch( err =>{
						next(err);
					});		

			
			
		}else{

					//insert new user
					let se = speakeasy.totp({secret: 'secret',  encoding: 'base32'});
					knex.returning('id').table('users').insert({ phone, vcode:se, name: 'defaultJCUname', status: 'Keep collecting...', teamjc_id: 1 })
					.then(id => {								
										
										return res.json({ error: false, userId: id[0], active: false, name: 'defaultJCUname', status_msg: 'Keep collecting...', app_version : game.app_version });
						
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
            
            
            var signed = 's:' + signature.sign( user.id + '::::' + user.scode , 'ilovescotchscotchyscotchscotch');
					  var data = cookie.serialize('connect.sid', signed, {});  

					  var prev = res.getHeader('jc-cookie') || [];
					  var header = Array.isArray(prev) ? prev.concat(data) : [prev, data];		

					  res.setHeader('jc-cookie', header);

					  if(user.id !== user.teamjc_id){
					  
						  knex.transaction( trx => {

						  		let d = new Date();
						  		let msgid = parseInt(''+d.getYear()+d.getMonth()+d.getDate()+d.getHours()+d.getMinutes());

									knex('chats').insert({ sender_id: user.teamjc_id, sender_msgid: msgid, receiver_id: user.id, sender_phone: 919005835708,
										eventname: 'new_msg', msg: 'Welcome to JewelChat', type:1, jeweltype_id:3, created_at: t.getTime()+1 }).transacting(trx)
									.then( () => {

										return knex('chats').insert({ sender_id: user.teamjc_id, sender_msgid: msgid+1, receiver_id: user.id, sender_phone: 919005835708,
										eventname: 'new_msg', msg: 'Collect jewels from each message', type:1, jeweltype_id:6, created_at: t.getTime()+5 }).transacting(trx);

									})
									.then( () => {

										return knex('chats').insert({ sender_id: user.teamjc_id, sender_msgid: msgid+2, receiver_id: user.id, sender_phone: 919005835708,
										eventname: 'new_msg', msg: 'Fulfill tasks to win points, coins and CASH', type:1, jeweltype_id:9, created_at: t.getTime()+10 }).transacting(trx);

									})																
									.then(trx.commit)
			        		.catch(trx.rollback);

							})   
							.then( values => {})
						  .catch( err => {});

						
						}  

						
  					return res.json({ error : false, request : 'verifyCode', created_at: t.getTime(), teamjcid: user.teamjc_id });

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
	

		let upd = {}; let ref_id;
		upd.name = req.body.name;
		if(req.body.reference){
			if(req.session.user.phone !== parseInt(req.body.reference)){
					
					knex('users').where({ phone: req.body.reference, initialized: true }).select('id')
					.then( user=>{
							if(user.length>0){
								upd.reference = req.body.reference;	ref_id = user[0].id;

									if(upd.reference && ref_id ){

											knex.transaction( trx => {

													knex('users').where({ id: req.session.user.id }).update(upd).transacting(trx)
													.then( () => {

														return knex('jewels').where({ user_id: ref_id, jeweltype_id: 2 }).increment('count', 1).transacting(trx);

													})
													.then( () => {

														return knex('jewels').where({ user_id: ref_id, jeweltype_id: 2 }).increment('total_count', 1).transacting(trx);

													})
													.then( () => {

														return knex('jewels').where({ user_id: req.session.user.id, jeweltype_id: 0 }).increment('total_count', 2).transacting(trx);

													})
													.then( () => {

														return knex('jewels').where({ user_id: req.session.user.id, jeweltype_id: 0 }).increment('count', 2).transacting(trx);

													})
													.then( () => {

														return knex('diamondlog').insert({ user_id: req.session.user.id, count : 2, logtext: 'Reference Number entry'}).transacting(trx);

													})
													.then(trx.commit)
							        		.catch(trx.rollback);

											})   
											.then( values => {
							    				return res.json({ error: false, name: req.body.name });
										  })
										  .catch( err => {
										    next(err);
										  });


									}else{

											knex('users').where({ id: req.session.user.id }).update(upd)
											.then(()=>{
													return res.json({ error: false, name: req.body.name });
											})
											.catch( err =>{
												next(err);
											});	

									}	


							}else{

											knex('users').where({ id: req.session.user.id }).update(upd)
											.then(()=>{
													return res.json({ error: false, name: req.body.name });
											})
											.catch( err =>{
												next(err);
											});	

							}
								
					})
					.catch( err =>{
						next(err);
					});

			}
		}

		

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


	knex('users').where({phone: req.body.phone, active:true }).select()
	.then(user=>{

			if(user.length>0)
				return res.json({error:false, phone: req.body.phone, invite:1, is_regis: true, contact: user[0]})
			else{

					knex('invite')	  
				  .insert({ user_id: req.session.user.id, invitee: req.body.phone  })
				  .then( val => {

				  		// send Invite 	SMS 
				  		return res.json({error: false, phone: req.body.phone,  invite: 1, is_regis:false });
				  })
				  .catch(err=>{
				  	next(err);
				  });

			}

	})
	.catch(err=>{
  	next(err);
  });
	

};


registration.getLeaderboard = function(req, res, next) {

	knex('scores').where({user_id: req.session.user.id}).select()
	.then(scores => {

			if(scores.length<=0)
				throw new Error('Illegal Operation');	

			let t1 = knex('scores').where({level:scores[0].level+1}).andWhere('points','>',0)
								.join('users','scores.user_id', '=', 'users.id')
								.orderBy('scores.points', 'desc')
								.select('users.id as id', 'users.pic as pic', 'users.name as name', 'scores.level as level', 'scores.points as points')
								.limit(5);
			p.push(t1);					

			let t2 = knex('scores').where({level:scores[0].level}).andWhere('points','>',scores[0].points)
								.join('users','scores.user_id', '=', 'users.id')
								.orderBy('scores.points', 'desc')
								.select('users.id as id', 'users.pic as pic', 'users.name as name', 'scores.level as level', 'scores.points as points')
								.limit(5);
			p.push(t2);									

			let t3 = knex('scores').where({level:scores[0].level}).andWhere('points','<',scores[0].points)
								.join('users','scores.user_id', '=', 'users.id')
								.orderBy('scores.points', 'desc')
								.select('users.id as id', 'users.pic as pic', 'users.name as name', 'scores.level as level', 'scores.points as points')
								.limit(10);
			p.push(t3);							

			let t4 = knex('scores').where({level:scores[0].level-1})
								.join('users','scores.user_id', '=', 'users.id')
								.orderBy('scores.points', 'desc')
								.select('users.id as id', 'users.pic as pic', 'users.name as name', 'scores.level as level', 'scores.points as points')
								.limit(10);					

			p.push(t4);						

			let p = [];


			Promise.all(p)
      .then( values => {

      	if(values.length>3){
      		if(values[2].length == 0 && values[3].length == 0)
      			return res.json({ error:false, top1:[], top2: [], top3: [], top4: [] }); 
      		else
      			return res.json({ error:false, top1: values[0], top2: values[1], top3: values[2], top4: values[3]});
      	}
      	else{
      		if(values[2].length == 0 && values[3].length == 0)
      			return res.json({ error:false, top1:[], top2: [], top3: [], top4: [] }); 
      		else	      
          	return res.json({ error:false, top1: values[0], top2: values[1], top3: values[2], top4: []});           
        }  	
      })      
      .catch(err=>{
      	next(err);
      });



	})
	.catch(err=>{
		next(err);
	})

};


registration.getBlockedUsers = function(req, res, next){		

				knex('blocked').where({ user_id: req.session.user.id }).join('users', 'users.id', '=', 'blocked.user_id')
				.select('users.id as id', 'users.phone as phone', 'users.name as name', 'users.status as status', 'users.pic as pic')
				.then(users => {
					return res.json({error: false, users })
				})
				.catch(err => {
					next(err);
				});		

};


registration.updateGcmToken= function(req, res, next) {
  
		let token = req.body.token;
		  	

		knex('users').where({id: req.session.user.id}).update({ token_google:token })
		.then(()=>{
			res.json({ error: false });
		})
		.catch( err => {
			next(err);
		});


};

registration.getCustomTokenFirebase = function(req, res, next) {		

		admin.auth().createCustomToken(req.session.user.id+'')
	  .then(function(customToken) {
	    return res.json({error: false, customToken })
	  })
	  .catch(err => {
	    next(err)
	  });


};

registration.getChildren= function(req, res, next) {
  
	  knex('users')
	  .where({reference: req.user.phone })
	  .join('scores', 'users.id', '=', 'scores.user_id')
	  .select('users.id as id', 'users.name as name', 'users.pic pic','scores.level', 'scores.points as points')
		.then( users =>{
			return res.json({ error: false, children: users });
		})
		.catch(err=>{
			next(err);
		});

};


 