'use strict'

let knex = require('../db/knex');
let Promise = require('bluebird');

let task = module.exports;


task.getTasks = function(req, res, next) {

  let subquery1 = knex('taskusers')
                 .where({ user_id: req.session.user.id , done : false })
                 .orderBy('taskusers.id', 'desc')
                 .select('task_id')
                 .limit(5).offset(req.body.page * 5);

  let subquery =  knex.raw('select * from ( '+subquery1+' ) temp_tab');                 
  
	knex('taskusers').whereIn('taskusers.task_id', subquery)
	.join('tasks', 'taskusers.task_id', '=', 'tasks.id')
	.join('taskdetails', 'taskusers.task_id', '=', 'taskdetails.task_id' )  	
	.select( 'taskusers.id as id','tasks.id as task_id', 'tasks.duration as duration', 'tasks.coins as coins', 'tasks.points as points'
    , 'tasks.money as money', 'tasks.level as level', 'tasks.created_at as created_at'
    , 'taskdetails.jeweltype_id as jeweltype_id', 'taskdetails.count as count', 'taskusers.done as done' )
  .groupBy('tasks.id')    	
	.then(tasks => {  		
			return res.json({error: false, tasks });  			
	})
	.catch(err => {
		next(err);
	});

};

task.getTaskElements= function(req, res, next) {
  
	knex('taskdetails').where({task_id: req.body.task_id})
	.select()
	.then(tasks => {  		
  		res.json({error: false, taskdetails});	
  	})
  	.catch(err => {
  		next(err);
  	});

};

task.redeemTask= function(req, res, next) {

  let taskusers_id = req.body.id;
  let user_id = req.session.user.id;

  let t_id, materials, points, coins, money, qty, level, expires_at;
  let user_materials, user_level, current_date = new Date();

  let show_money;

  knex('taskusers').where({id:taskusers_id}).select()
  .then(taskuser => {

    if(taskuser.length == 0)
      throw new Error('Invalid Task');

    show_money = taskuser[0].show_money;

    return knex('tasks').where({ id:taskuser[0].task_id }).select();

  })  
  .then(task=>{

      t_id = task[0].id;
      points = task[0].points;
      coins = task[0].coins;
      money = task[0].money;
      qty = task[0].qty;
      level = task[0].level;
      expires_at = task[0].duration;   

      if(qty === null)
        continue;
      else if(qty == 0)
         throw new Error('Task expired');    

      let e = new Date(expires_at);

      if(e < current_date)
        throw new Error('Task expired');


      return knex('scores').where({ user_id: req.session.user.id }).select();

  })
  .then(score => {

    if(score.level<level)
      throw new Error('Invalid operation');

    return knex('taskdetails').where({ task_id: t_id }).select('jeweltype_id', 'count');

  })
  .then( details => {



    
      knex.transaction( trx => {

          let p = []; let t;

          for(let j=0; j<details.length; j++){
            t = knex('jewels').where({ user_id, jeweltype_id: details[j].jeweltype_id })
            .andWhere('count', '>', details[j].count )
            .decrement('count', details[j].count).transacting(trx);

            p.push(t);
          }

            if( qty === null )
              continue;
            else{
              t = knex('tasks').where({ id: t_id })
              .andWhere('qty', '>', 0 )
              .decrement('qty', 1).transacting(trx);

              p.push(t);
            }

            t = knex('taskusers').where({id:taskusers_id }).update({'done': true}).transacting(trx);
            p.push(t);


            t = knex('scores').where({user_id }).update({points}).transacting(trx);
            p.push(t);

            t = knex('jewels').where({ user_id, jeweltype_id: 1 }).increment({ count: coins }).transacting(trx);
            p.push(t);

            t = knex('jewels').where({ user_id, jeweltype_id: 1 }).increment({ total_count: coins }).transacting(trx);
            p.push(t);

            if(show_money && money>0)
            t = knex('wallet').where({ user_id }).increment({ total_count: coins }).transacting(trx);
            p.push(t);

            t = knex('taskusers').where({id:taskusers_id }).update({'done': true}).transacting(trx);
            p.push(t);



            return Promise.all(p);  


      })
      .then( values => {

        for( let i=0; i<values.length; i++ ){
          if(values[i] == 0 )
            new Error('Transaction failed');
        }

        return true;

      })
      .then(trx.commit)
      .catch(err => {
        trx.rollback
        throw err;
      });

  })  
  .catch( err => {
    next(err);
  })
  
	

};

task.getAchievements= function(req, res, next) {
  
	knex('achievementusers').where({ user_id: req.session.user.id })
  	.join('achievements', 'achievementusers.achievement_id', '=', 'achievements.id')
  	//.join('taskdetails', 'taskusers.task_id', '=', 'taskdetails.task_id' )
  	.orderBy('achievementusers.level', 'asc')
  	.select()
  	.limit(8).offset(req.body.page * 8)
  	.then(achievements => {
  		
  			res.json({error: false, achievements });
  		
  	})
  	.catch(err => {
  		next(err);
  	});

};

task.redeemAchievement = function(req, res, next) {
  
	

};

function points(type, count){

        if(type==3)
          return count;
        else if(type==4)
          return count * 2;
        else if(type==5)
          return count * 4;
        else if(type==6)
          return count * 2;
        else if(type==7)
          return count * 4;
        else if(type==8)
          return count * 8;
        else if(type==9)
          return count * 4;
        else if(type==10)
          return count * 8;
        else if(type==11)
          return count * 16;
        else if(type==12)
          return count * 8;
        else if(type==13)
          return count * 16;
        else if(type==14)
          return count * 32;
        else if(type==15)
          return count * 16;
        else if(type==16)
          return count * 32;
        else if(type==17)
          return count * 64; 
        else if(type==0)
          return count * 100;                              
        else
          return 0;       

        
}

function coins(type, count){

        if(type==3)
          return count * 3;
        else if(type==4)
          return count * 4;
        else if(type==5)
          return count * 5;
        else if(type==6)
          return count * 6;
        else if(type==7)
          return count * 7;
        else if(type==8)
          return count * 8;
        else if(type==9)
          return count * 9;
        else if(type==10)
          return count * 10;
        else if(type==11)
          return count * 11;
        else if(type==12)
          return count * 12;
        else if(type==13)
          return count * 13;
        else if(type==14)
          return count * 14;
        else if(type==15)
          return count * 15;
        else if(type==16)
          return count * 16;
        else if(type==17)
          return count * 17;
        else if(type==0)
          return count * 1;                              
        else
          return 0;

}

task.generateTasks = function(req, res, next) {

  for(let k=0; k<5000; k++){

          let jj = []; jj = [3,6,9,12,15,3,6,9,12,15,3,6,9,12,15,3,6,9,12,15,3,6,9,12,15,3,6,9,12,15,0,4,7,5,8,10,4,7,5,8,10,4,7,5,8,10,4,7,5,8,10,11,13,14,16,17,11,13,14,16,17,0];

          let jt = [];


          let loop  = Math.floor(Math.random() * (5 - 1 + 1)) + 1;

          let sump = 0, sumc = 0, summ=0;  let materials = [];

          for(let i=1; i<=loop;i++){

            let flag=true; let t=0;

            while(flag){

              t = Math.floor(Math.random() * (jj.length - 1 + 1)) + 1;
              flag=false;
              for(let j=0; j<jt.length; j++){
                if(jt[j] == t){
                    flag=true;
                    break;
                  }

              }

              jt.push(t);

            }

            let c = 0;

            if( jj[t-1] == 0)
              c = 1;
            else
              c = Math.floor(Math.random() * (5 - 1 + 1)) + 1;

            sump+=points(jj[t-1],c);
            sumc+= coins(jj[t-1],c);

            materials.push([ jj[t-1], c])    

          }  

          if(sump>100){
            let x =sump-100;
            summ = Math.floor(x/25) * 0.25;
          }else
            summ = 0.00;

          


          
          knex.transaction( trx => {      

                knex('tasks').returning('id').insert({ points: sump, coins:sumc, money:summ }).transacting(trx)
                .then( (id) =>{

                    let a = []; let t;

                   for(let i=0; i<materials.length; i++){
                      //console.log( '>>>>'+id+'::::::'+materials[i][0]+'::::::::'+materials[i][1]);
                      t = knex.table('taskdetails').insert({task_id: id, jeweltype_id: materials[i][0], count: materials[i][1] }).transacting(trx);
                      a.push(t);

                      
                   } 

                   return Promise.all(a);
                    
                })        
                .then(trx.commit)
                .catch(trx.rollback);

          })
          .then( values => {
            
          })
          .catch( err => {
            
          });

  }        

  return res.json({error: false});

};



