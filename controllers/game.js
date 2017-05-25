'use strict'

let game = module.exports;
let knex = require('../db/knex');

game.pickJewel = function(req, res, next) {
  
	

};
game.getGameState = function(req, res, next) {
  
	

};

game.getFactories = function(req, res, next) {
  
	

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

