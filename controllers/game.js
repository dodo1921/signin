'use strict'

let game = module.exports;
let knex = require('../db/knex');
let Promise = require('bluebird');

game.pickJewel = function(req, res, next) {


    knex.transaction(function(trx) {      

          Promise.all([
                  knex.insert({id: 13, name: 'j11', min_cost: 5000 }).into('jeweltype').transacting(trx),
                  knex.insert({id: 11, name: 'j9', min_cost: 5000 }).into('jeweltype').transacting(trx),
                  knex.insert({id: 12, name: 'j10', min_cost: 5000 }).into('jeweltype').transacting(trx)
          ])         
          .then(trx.commit)
          .catch(trx.rollback);

    })
    .then(function() {
      res.json({error: false});
    })
    .catch(function(error) {
      // If we get here, that means that neither the 'Old Books' catalogues insert,
      // nor any of the books inserts will have taken place.
      next(error)
    });

				

};


game.getGameState = function(req, res, next) {
  	
	  Promise.all([
	  	knex('scores').where({ user_id: req.user.id }).select(),
	  	knex('jewels').where({ user_id: req.user.id }).select()
	  ])	
		.then((values)=>{
			res.json({ error: false, scores: values[0], jewels: values[1] });
		})
		.catch( err => {
			next(err);
		});	

};

game.getFactories = function(req, res, next) {
  
  	knex('factoryuser').where({ user_id: req.body.user_id })
  	.join('factory', 'factoryuser.factory_id', '=', 'factory.id')
  	.join('factorymaterial', 'factoryuser.factory_id', '=', 'factorymaterial.factory_id' )
  	.select()
  	.then(fac => {
  		res.json({error: false, factory : fac});
  	})
  	.catch(err => {
  		next(err);
  	});
	

};

game.startFactory = function(req, res, next) {
  
  knex('factoryuser').where({id: req.body.factoryuser_id, is_on: false }).update({ is_on: true, start_time: knex.fn.now() })
  .then(() => {

  	knex('factoryuser').where({id: req.body.factoryuser_id}).select()
  	.then( fac => {
  		res.json({error: false, factory: fac });
  	})
  	.catch(err => {
  		next(err);
  	})

  	
  })
  .catch(err => {
  	next(err);
  });
	

};

game.stopFactory = function(req, res, next) {
  
	

};

game.getJewelFromFactory = function(req, res, next) {
  
	

};

game.getMarket = function(req, res, next) {
  
	

};

game.getMyShop = function(req, res, next) {
  
	

};

game.addToShop = function(req, res, next) {
  
	

};

game.getUserShop = function(req, res, next) {
  
	

};

