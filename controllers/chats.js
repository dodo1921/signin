'use strict'

let chats = module.exports;
let knex = require('../db/knex');
let Promise = require('bluebird');

chats.getAllGroupChatMessages = function(req, res, next) {
  
	
		let lastgroupchatid	 = req.body.lastgroupchatid;
		let page = req.body.page;

		knex('groupmembers').where({ user_id: req.user.id })
		.select('groupmembers.group_id')
		.then(groups => {		
					
					knex('groupchats').whereIn('group_id', groups ).andWhere('id', '>', lastgroupchatid )
					.orderBy('id', 'asc').select().limit(20).offset(page * 20)
					.then( groupchats => {
							
							if(groupchats.length>=20)
								res.json({error: false, groupchats, pageno: (page + 1) })
							else 
								res.json({error: false, groupchats})
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
  
		let lastonetooneid = req.body.lastonetooneid;
		let page = req.body.page;
		
		knex('chats').where( { receiver_id : req.user.id } ).andWhere('id', '>', lastonetooneid )
		.orderBy('id', 'asc').select().limit(20).offset(page * 20)
		.then( chats => {
				
				if( chats.length>=20)
					res.json({ error: false, chats, pageno: (page + 1) });
				else 
					res.json({ error: false, chats });

		})
		.catch(err => {
			next(err);
		})	
	

};



