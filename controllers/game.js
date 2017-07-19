'use strict'

let game = module.exports;
let knex = require('../db/knex');
let Promise = require('bluebird');



function innerpickjewel( req, res, next, jewel ,msg_id, jeweltype){

    if(jewel[0].jeweltype_id === jeweltype ){

          console.log("Here>>>>>>>>>>><<<<<<");

          knex('jewels')
          .where({ user_id : req.session.user.id })
          .whereNotIn('jeweltype_id', [ 0, 1, 2 ])
          .sum('count as c')
          .then( count => {
              console.log("Here>>>>>>>>>>>"+count[0].c);
             if( count[0].c < 25  ){



                          knex.transaction( trx => {

                              let p = []; let t;

                              t = knex('jewels').where({user_id: req.session.user.id, jeweltype_id: jeweltype })
                                                .increment('count', 1).transacting(trx);
                              p.push(t); 
                              
                              t = knex('jewels').where({user_id: req.session.user.id, jeweltype_id: jeweltype })
                                                .increment('total_count', 1).transacting(trx);
                              p.push(t);                           

                              
                              Promise.all(p)                              
                              .then(trx.commit)
                              .catch(trx.rollback);

                          })   
                          .then( values => {
                              return res.json({ error: false, message: 'Jewel added'});
                          })
                          .catch( err => {
                            next(err);
                          });
                          
                                         

             }else{
                throw new Error('Jewel Store is full')
             } 

          })          
          .catch( err => {    
            console.log("Here>>>>>>>>>>>Error"+err);
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

            knex('groupchats').where({ id : msg_id }).select('jeweltype_id')
            .then(jewel => {
                innerpickjewel(req, res, next, jewel, msg_id, jeweltype);
            })
            .catch(err=>{
              next(err);
            });          

      }else{

            knex('chats').where({ id : msg_id }).select('jeweltype_id')
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
	  	knex('scores').where({ user_id: req.session.user.id }).select(),
	  	knex('jewels').where({ user_id: req.session.user.id }).select()
	  ])	
		.then((values)=>{
			return res.json({ error: false, scores: values[0], jewels: values[1] });
		})
		.catch( err => {
			next(err);
		});	

};

game.getFactories = function(req, res, next) {

  let subquery1 = knex('factoryuser')
                 .where({ user_id: req.session.user.id})
                 .orderBy('factory_id', 'asc')
                 .select('id')
                 .limit(5).offset(req.body.page * 5);

  let subquery =  knex.raw('select * from ( '+subquery1+' ) temp_tab');              
  
  knex('factoryuser').whereIn('factoryuser.id', subquery)
  .join('factory', 'factoryuser.factory_id', '=', 'factory.id')
  .join('factorymaterial', 'factoryuser.factory_id', '=', 'factorymaterial.factory_id' )    
  .select('factory.id as id', 'factory.jeweltype_id as factory_type', 'factory.level as level', 'factory.count as amount'
    , 'factory.duration as duration', 'factoryuser.start_time as start_time', 'factoryuser.is_on as is_on'
    , 'factorymaterial.jeweltype_id as jeweltype_id', 'factorymaterial.count as count', 'factory.diamond as diamond')      
  .then(fac => {      
      return res.json({error: false ,fac , time: new Date() });        
  })
  .catch(err => {
    next(err);
  });
  
  	
	

};

game.getFactoryMaterials= function(req, res, next) {
  
  knex('factorymaterial').where({factory_id: req.body.factory_id})
  .select()
  .then(materials => {      
      res.json({error: false, materials});  
    })
    .catch(err => {
      next(err);
    });

};



game.startFactory = function(req, res, next) {

  let user_id = req.session.user.id;
  let factory_id = req.body.id;

  let ct;

  knex('factoryuser').where({ factory_id, user_id }).select()
  .then(factoryuser => {

    if(factoryuser.length == 0)
      throw new Error('Invalid Factory');

    if(factoryuser[0].is_on)
      throw new Error('Factory on');

    return knex('factorymaterial').where({factory_id}).select()

  })
  .then( materials => {

        knex.transaction( trx => {

            let p = []; let t;

            for(let i=0; i<materials.length; i++){
              t = knex('jewels').where({user_id, jeweltype_id: materials[i].jeweltype_id})
                                .where('count', '>', materials[i].count ).decrement('count', materials[i].count)
                                .transacting(trx);
              p.push(t);
              
              if(materials[i].jeweltype_id == 1){
                t =   knex('coinlog').insert({ user_id, count: -(materials[i].count), logtext: 'Factory Start....'+factory_id })
                                     .transacting(trx);
                p.push(t);
              }                    
            } 

            ct = new Date();

            t =   knex('factoryuser').where({ factory_id, user_id }).update({ is_on : true , start_time: ct })
                                     .transacting(trx);
            p.push(t);           

            
            Promise.all(p)
            .then( values => {

              for( let i=0; i<values.length; i++ ){
                console.log('>>>>>>>'+values[i]);
                if(values[i] == 0 )
                  throw new Error('Transaction failed');
              }              

            })
            .then(trx.commit)
            .catch(trx.rollback);

        })   
        .then( values => {
            return res.json({ error: false, start_time: ct });
        })
        .catch( err => {
          next(err);
        });

  })
  .catch(err => {
    next(err);
  })



};

game.stopFactory = function(req, res, next) {

  let user_id = req.session.user.id;
  let factory_id = req.body.id;

  let current_time = new Date(); 
  let st, st2 , duration, produce_count, factory_jewel_type, jewelstore_count, diamond_deduction_flag, diamond_required, diamond_u_have;


  knex('factoryuser').where({ factory_id, user_id }).select()
  .then(factoryuser => {

    if(factoryuser.length == 0)
      throw new Error('Invalid Factory');

    if(!factoryuser[0].is_on)
      throw new Error('Factory is not on');

    if(!factoryuser[0].start_time){
      //stop the factory
      knex('factoryuser').where({ factory_id, user_id }).update({is_on:false})
      .then(val=>{
        throw new Error('Invalid data');        
      })
      .catch(err=>{
        next(err);
      })
    }else{
      st = new Date(factoryuser[0].start_time);  
      st2 = new Date(factoryuser[0].start_time);      
      return knex('factory').where({id: factory_id}).select();
    }

  })
  .then( factory => {

    duration = factory[0].duration;
    produce_count = factory[0].count;
    diamond_required = factory[0].diamond;
    factory_jewel_type = factory[0].jeweltype_id;

    return knex('jewels').where({user_id}).select('jeweltype_id', 'count');

  })
  .then(jewelstore => {

    jewelstore_count = 0;

    for(let i=0; i < jewelstore.length; i++){

      if(jewelstore[i].jeweltype_id == 0)
        diamond_u_have = jewelstore[i].count;

      if(jewelstore[i].jeweltype_id > 2)
        jewelstore_count += jewelstore[i].count;

    }

    if(jewelstore_count+produce_count>25)
      throw new Error('Not enough Space');
    console.log('Start time:::'+st);
    st.setSeconds(st.getSeconds() + duration); 
    console.log('Start time plus duration :::'+st);
    console.log('Current time :::'+current_time);

    if( st < current_time )
      diamond_deduction_flag = false;
    else{
      diamond_deduction_flag = true;
      if(diamond_u_have<diamond_required)
        throw new Error('Not Enough diamonds');
    }


        knex.transaction( trx => {

            let p = []; let t;

            t = knex('jewels').where({ user_id, jeweltype_id: factory_jewel_type }).increment('count', produce_count).transacting(trx); 
            p.push(t);

            t = knex('jewels').where({ user_id, jeweltype_id: factory_jewel_type }).increment('total_count', produce_count).transacting(trx); 
            p.push(t); 

            t = knex('factoryuser').where({ user_id, factory_id }).update({ is_on:false, start_time: null }).transacting(trx); 
            p.push(t); 


            if(diamond_deduction_flag){

              t = knex('jewels').where({ user_id, jeweltype_id: 0 }).decrement('count', diamond_required).transacting(trx); 
              p.push(t);              

              t = knex('diamondlog').insert({ user_id , count : -(diamond_required), logtext: 'Factory stopped'+factory_id }).transacting(trx);
              p.push(t);

            }   

            t = knex('factoryuser').where({ user_id, factory_id }).update({ is_on:false, start_time: null }).transacting(trx); 
            p.push(t); 

            t = knex('factorylogs').insert({ user_id, factory_id, start_time: st2, end_time: current_time, diamond_used: diamond_deduction_flag }).transacting(trx); 
            p.push(t); 

            
            Promise.all(p)
            .then( values => {

              for( let i=0; i<values.length; i++ ){
                console.log('>>>>>>>'+values[i]);
                if(values[i] == 0 )
                  throw new Error('Transaction failed');
              }              

            })
            .then(trx.commit)
            .catch(trx.rollback);

        })   
        .then( values => {
            return res.json({ error: false, message: 'Factory stopped' });
        })
        .catch( err => {
          next(err);
        });
      


  })
  .catch(err=>{
    console.log('Error::::'+err);
    next(err);
  })
  
	

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

