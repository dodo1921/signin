'use strict'

let game = module.exports;
let knex = require('../db/knex');
let Promise = require('bluebird');



function innerpickjewel( req, res, next, jewel ,msg_id, jeweltype){

    if(jewel[0] === jeweltype ){

          knex('jewels')
          .where({ user_id : req.user.id })
          .andWhereNotIn('jeweltype_id', [1, 2])
          .sum('count')
          .then( count => {

             if( count[0] < 25  ){

                knex('jewels')
                .where({ user_id : req.user.id, jeweltype_id : jeweltype })
                .select()
                .then( row => {
                      if(row.length>0){

                          let count = row[0].count+1;
                          let total_count = row[0].total_count + 1;
                          let t = knex.fn.now();

                          knex('jewels')
                          .where({ user_id : req.user.id, jeweltype_id : jeweltype })
                          update({ count, total_count, updated_at: t })
                          .then( () => {
                              res.json({error: false})
                          })
                          .catch(err=>{
                            next(err);
                          });

                      }else{

                          knex.table('jewels')
                          .where({ user_id : req.user.id})
                          .insert({ jeweltype_id : jeweltype , count: 1, total_count: 1 })
                          .then( () => {
                              res.json({error: false})
                          })
                          .catch(err=>{
                            next(err);
                          });

                      }
                })
                .catch(err=>{
                  next(err);
                });

             }else{
                res.json({error: false, msg: 'Jewel Store Full'})  
             } 

          })
          .catch( err => {
            next(err)
          })

    }else{
      console.log('Jeweltype mismatch');
      let err = new Error('Jewel type mismatch');
      next(err);
    }


}


game.pickJewel = function(req, res, next) {


      let jeweltype = req.body.jeweltype;
      let is_group = req.body.is_group;
      let msg_id = req.body.msg_id;

      if(is_group){

            //  find msg check jeweltype
            //check total count less than 25
            //  update or insert jeweltype count

            knex('groupchats').where({ id : msg_id }).select('jeweltype')
            .then(jewel => {
                innerpickjewel(req, res, next, jewel, msg_id, jeweltype);
            })
            .catch(err=>{
              next(err);
            });          

      }else{

            knex('chats').where({ id : msg_id }).select('jeweltype')
            .then(jewel => {
                innerpickjewel(req, res, next, jewel, msg_id, jeweltype);
            })
            .catch(err=>{
              next(err);
            });

      }   
				

};




/*
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

*/


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

