'use strict'

let knex = require('../db/knex');
let Promise = require('bluebird');

let wallet = module.exports;


wallet.getWallet = function(req, res, next) {
	
	let m;
  	
	knex('wallet').where({user_id: req.session.user.id}).select()
	.then(entry => {
		
		m = entry[0].money;
		return knex('walletlog').where({user_id: req.session.user.id, tag:'redeem' }).max('created_at');		

	})
	.then( val => {

		console.log('Last redeem time:::'+val[0].created_at);

		let last_redeem_time = new Date(val[0].created_at);
		let now = new Date();

		let diff = (last_redeem_time.getTime() - now.getTime())/(86400000); 


		if( entry.length > 0 )
			return res.json({error:false, value: m, flag: diff>1?true:false });
		else
			return res.json({error:false, value: 0.00: diff>1?true:false });

	})
	.catch(err=>{		
		next(err);
	})
	

};

wallet.redeemMoney = function(req, res, next) {

	let m = 0;

	knex('wallet').where({ user_id: req.session.user.id })
  .select()
	.then( entry => {

			m = entry[0].money;	

			if(m<50.00)
				throw new Error('Not enough money in wallet');


				knex.transaction( trx => {

								knex('walletlog').insert({ user_id: req.session.user.id, money: -50.00, tag:'redeem' }).transacting(trx)
								.then( () => {

									return knex('wallet').where({ user_id: req.session.user.id }).decrement( 'money', 50.00 ).transacting(trx);

								})	
								.then( () => {

									return knex('moneytogive').insert({ user_id: req.session.user.id, money: 50.00 }).transacting(trx);

								})						
								.then(trx.commit)
		        		.catch(trx.rollback);

				})   
				.then( values => {
						return res.json({ error: false, money: (m-50.00) });
			  })
			  .catch( err => {
			    next(err);
			  });		
			
				
		})		
		.catch( err => {
			next(err);
		});
		

};

wallet.buyDiamonds = function(req, res, next) {

	let d_id = req.body.id; let d=0, m=0, money=0; 

	if(d_id == 1 ){
		d=10; m=30;
	}else if(d_id == 2 ){
		d=20; m=57;
	}else if(d_id ==3 ){
		d=30; m=81;
	}

	knex('wallet').where({ user_id: req.session.user.id }).select()
	.then(entry =>{

			money = entry[0].money;

			if( d==0 || m==0 )
				throw new Error('Illegal Input');

			if(entry[0].money < m)
				throw new Error('Not enough money in wallet');

			knex.transaction( trx => {

							knex('walletlog').insert({ user_id: req.session.user.id, money: -m, tag:'Diamond buy '+ m }).transacting(trx)
							.then( () => {

								return knex('wallet').where({ user_id: req.session.user.id }).decrement( 'money', m ).transacting(trx);

							})	
							.then( () => {

								return knex('jewels').update({ user_id: req.session.user.id, jeweltype_id: 0 }).increment('count', d ).transacting(trx);

							})
							.then( () => {

								return knex('jewels').update({ user_id: req.session.user.id, jeweltype_id: 0 }).increment('total_count', d ).transacting(trx);

							})						
							.then(trx.commit)
		      		.catch(trx.rollback);

			})   
			.then( values => {
					return res.json({ error: false, money: (money-m) });
		  })
		  .catch( err => {
		    next(err);
		  });	

	})
	.catch(err => {
		next(err);
	});


};

wallet.buyCoins = function(req, res, next) {
  
  let d_id = req.body.id; let d=0, m=0, money = 0;

	if(d_id == 1 ){
		d=100; m=20;
	}else if(d_id == 2 ){
		d=200; m=38;
	}else if(d_id ==3 ){
		d=300; m=55;
	}

	knex('wallet').where({ user_id: req.session.user.id }).select()
	.then(entry =>{

			money = entry[0].money;
			
			if( d==0 || m==0 )
				throw new Error('Illegal Input');

			if(entry[0].money < m)
				throw new Error('Not enough money in wallet');

			knex.transaction( trx => {

							knex('walletlog').insert({ user_id: req.session.user.id, money: -m, tag:'Coin buy '+ m }).transacting(trx);
							.then( () => {

								return knex('wallet').where({ user_id: req.session.user.id }).decrement( 'money', m ).transacting(trx);

							})	
							.then( () => {

								return knex('jewels').update({ user_id: req.session.user.id, jeweltype_id: 1 }).increment('count', d ).transacting(trx);

							})
							.then( () => {

								return knex('jewels').update({ user_id: req.session.user.id, jeweltype_id: 1 }).increment('total_count', d ).transacting(trx);

							})						
							.then(trx.commit)
		      		.catch(trx.rollback);

			})   
			.then( values => {
					return res.json({ error: false, money: (money-m) });
		  })
		  .catch( err => {
		    next(err);
		  });	

	})
	.catch(err => {
		next(err);
	});
	

};
