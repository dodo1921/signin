'use strict'

let chats = module.exports;
let knex = require('../db/knex');
let Promise = require('bluebird');

chats.getAllGroupChatMessages = function(req, res, next) {
  
	
		let lastgroupchatid	 = req.body.created_at;
		let page = req.body.page;

		knex('groupmembers').where({ user_id: req.session.user.id })
		.select('groupmembers.group_id')
		.then(groups => {		
					
					knex('groupchats').whereIn('group_id', groups ).andWhere('id', '>', lastgroupchatid )
					.orderBy('id', 'asc').select().limit(20).offset(page * 20)
					.then( groupchats => {
							
							if(groupchats.length>=20)
								res.json({error: false, groupchats, pageno: (page + 1) })
							else 
								res.json({error: false, groupchats, pageno: -1, created_at: new Date().getTime() })
					})
					.catch(err => {
						next(err);
					})	

		})
		.catch(err => {
			next(err);
		});

};

chats.getAllChatMessages = function(req, res, next) {
  
		let created_at = req.body.created_at;
		let page = req.body.page;

		let today = new Date();
		let created_time = new Date(created_at);	
		
		knex('chats').where( { receiver_id : req.session.user.id } ).andWhere('created_at', '>', created_at )
		.orderBy('id', 'asc').select().limit(20).offset(page * 20)
		.then( chats => {
				
				if( chats.length>=20 )
					return res.json({ error: false, chats, pageno: (page + 1) });
				else 
					return res.json({ error: false, chats, pageno: -1, created_at: new Date().getTime() });

		})
		.catch(err => {
			next(err);
		})	
	

};



