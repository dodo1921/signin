'use strict'

let knex = require('../db/knex');
let Promise = require('bluebird');

let level_max = [55,289,346,313,241,220,290,410,491,481,411,367,412,526,627,643,583,523,541,642,756,799,755,685,677,759,879,947,924,853,820,879,997,1088,1090,1024,972,1004,1113,1221,1250,1196,1131,1136,1229,1347,1402,1367,1296,1276,1347,1467,1547,1535,1465,1423,1470,1584,1684,1698,1637,1578,1598,1700,1813,1855,1809,1740,1733,1817,1936,2003,1979,1907,1876,1937,2055,2144,2145,2078,2027,2061,2171,2278,2305,2250,2186,2193,2287,2404,2458,2421,2350,2332,2405,2525,2603,2590,2519,2478,2527,2642,2740,2753,2691,2633,2655,2758,2870,2910,2863,2795,2789,2874,2994,3059,3033,2962,2932,2994,3112,3201,3200,3132,3082,3118,3229,3334,3360,3304,3240,3249,3345,3461,3514,3476,3405,3388,3462,3582,3659,3644,3574,3534,3584,3700,3797,3808,3745,3688,3711,3816,3927,3965,3917,3849,3846,3932,4051,4115,4088,4016,3988,4051,4170,4257,4254,4186,4138,4175,4287,4391,4415,4359,4295,4306,4402,4518,4569,4530,4459,4444,4520,4640,4715,4699,4628,4590,4641,4757,4853,4863,4800,4743,4768,4873,4984,5021,4972,4904,4902];

let task = module.exports;


task.getTasks = function(req, res, next) {

  let subquery1 = knex('taskusers')
                 .where({ user_id: req.session.user.id , done : false })
                 .orderBy('taskusers.id', 'desc')
                 .select('id')
                 .limit(5).offset(req.body.page * 5);

  let subquery =  knex.raw('select * from ( '+subquery1+' ) temp_tab');                 
  
	knex('taskusers').whereIn('taskusers.id', subquery)
	.join('tasks', 'taskusers.task_id', '=', 'tasks.id')
	.join('taskdetails', 'taskusers.task_id', '=', 'taskdetails.task_id' )   	
	.select( 'taskusers.id as id', 'tasks.id as task_id', 'tasks.duration as duration', 'tasks.coins as coins', 'tasks.points as points'
    , 'taskusers.show_money as show_money' ,'tasks.money as money', 'tasks.qty as qty', 'taskusers.level as level', 'tasks.created_at as created_at'
    , 'taskdetails.jeweltype_id as jeweltype_id', 'taskdetails.count as count', 'taskusers.done as done' )
  .orderBy('tasks.money', 'desc')       	
	.then(tasks => {  		
			return res.json({error: false, tasks, time: new Date() });  			
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

  let t_id, materials, points, coins, money, qty, level, expires_at, max_level_points, pp, score_level;
  let user_materials, user_level, current_date = new Date();

  let show_money;

  knex('taskusers').where({id:taskusers_id, done: false }).select()
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


      
      if(qty !== null && qty <= 0)
         throw new Error('Task expired');   

      //if(expires_at === null)
        //continue;
      if(expires_at !== null){

        let e = new Date(expires_at);

        if(e < current_date)
          throw new Error('Task expired');
      
      }

      return knex('scores').where({ user_id }).select();

  })
  .then(score => {

    max_level_points = score[0].max_level_points; 
    pp = score[0].points;
    score_level = score[0].level;

    if(score.level<level)
      throw new Error('Invalid operation');

    return knex('taskdetails').where({ task_id: t_id }).select('jeweltype_id', 'count');

  })
  .then( details => {
    
      knex.transaction( trx => {

          let p = []; let t;

          for(let j=0; j<details.length; j++){
            t = knex('jewels').where({ user_id, jeweltype_id: details[j].jeweltype_id })
            .andWhere('count', '>=', details[j].count )
            .decrement('count', details[j].count).transacting(trx);

            p.push(t);

            if(details[j].jeweltype_id == 0){
              t = knex('diamondlog').insert({ user_id , count : -(details[j].count), logtext: 'Task Completed....'+taskusers_id }).transacting(trx);
              p.push(t);
            }
          }

            //if( qty === null )
            //  continue;
            if( qty !== null ){
              t = knex('tasks').where({ id: t_id })
              .andWhere('qty', '>', 0 )
              .decrement('qty', 1).transacting(trx);

              p.push(t);
            }

            t = knex('taskusers').where({id:taskusers_id }).update({'done': true}).transacting(trx);
            p.push(t);

            if(pp+points<=max_level_points){
              t = knex('scores').where({user_id }).increment('points', points).transacting(trx);
              p.push(t);
            }else{

              t = knex('scores').where({user_id }).update({ points : (pp + points - max_level_points) }).transacting(trx);
              p.push(t);
              t = knex('scores').where({user_id }).increment('level', 1).transacting(trx);
              p.push(t);
              t = knex('scores').where({user_id }).update({ max_level_points: level_max[score_level]}).transacting(trx);
              p.push(t);
            }    

            //t = knex('pointlog').insert({ user_id, count: points, logtext: 'Task complete....'+taskusers_id }).transacting(trx);
            //p.push(t);        

            t = knex('jewels').where({ user_id, jeweltype_id: 1 }).increment('count', coins ).transacting(trx);
            p.push(t);

            t = knex('jewels').where({ user_id, jeweltype_id: 1 }).increment('total_count', coins ).transacting(trx);
            p.push(t);

            //t = knex('coinlog').insert({ user_id, count: coins, logtext: 'Task complete....'+taskusers_id }).transacting(trx);
            //p.push(t);

            if(show_money && money>0.0){
              console.log('<<<<<<'+money);
              t = knex.raw('update wallet set money = money + :money where user_id = :user_id', {money, user_id}).transacting(trx);
              //t = knex('wallet').where({ user_id }).increment('money', money ).transacting(trx);
              p.push(t);

              //t = knex('walletlog').insert({ user_id, money }).transacting(trx);
              //p.push(t);
            }  

            t = knex('taskusers').where({id:taskusers_id }).update({'done': true}).transacting(trx);
            p.push(t);



            Promise.all(p)
            .then( values => {

              for( let i=0; i<values.length; i++ ){
                console.log('>>>>>>>'+values[i]);
                if(values[i] == 0 ){                  
                  throw new Error('Transaction failed');
                }
              }
                           

            })
            .then(trx.commit)
            .catch(trx.rollback)



      })
      .then( () => {

          //check if money available

          if(qty === null){

              let t_id;

              if(score_level<7)
                t_id = Math.floor(Math.random() * (2000 - 10 + 1)) + 10;
              else if(score_level>=7 && score_level<17)
                t_id = Math.floor(Math.random() * (3000 - 10 + 1)) + 10;
              else if(score_level>=17 && score_level<27)
                t_id = Math.floor(Math.random() * (4000 - 10 + 1)) + 10;
              else if(score_level>=27 )  
                t_id = Math.floor(Math.random() * (5000 - 10 + 1)) + 10;

              knex('money').select()
              .then( money => {
                  console.log('Money>>>>>>>>'+money[0].money);
                  if(money[0].money>10.00)
                    return knex('taskusers').insert({ user_id , task_id: t_id });
                  else{
                    knex('taskusers').insert({ user_id , task_id: t_id, show_money: false })
                    .then(()=>{})
                    .catch(()=>{})
                  }
              })          
              .then( val => {
                  return knex('tasks').where({id: t_id}).select('money');
              })
              .then( m => {
                  console.log('Money<<<<<<'+m[0].money);
                  let x = m[0].money;
                  return knex.raw('update `money` set money = money - :x', {x});
              })
              .catch( err => {
                  console.log('ERROR ERROR '+err);
              })

          }    

        return res.json({ error: false, message: 'Successfully task completed' });
      })
      .catch(err => {
        next(err);
      })
      

  })  
  .catch( err => {
    next(err);
  })
  
	

};

task.getAchievements= function(req, res, next) {
  
	knex('achievementusers').where({ user_id: req.session.user.id })
  	.join('achievements', 'achievementusers.achievement_id', '=', 'achievements.id')
  	//.join('taskdetails', 'taskusers.task_id', '=', 'taskdetails.task_id' )
  	//.orderBy('achievementusers.level', 'asc')
    .orderBy('achievements.id', 'asc')
  	.select('achievementusers.level as level', 'achievements.id as aid', 'achievements.diamond as diamond',
      'achievements.text as text', 'achievements.note as note', 'achievementusers.id as id' )
  	.limit(9).offset(req.body.page * 9)
  	.then(achievements => {
  		
  			res.json({error: false, achievements });
  		
  	})
  	.catch(err => {
  		next(err);
  	});

};


function complete_achievement(diamonds, a_id, user_id, req, res, next){

  knex.transaction( trx => {    

    knex('jewels').where({user_id, jeweltype_id: 0 }).increment('count', diamonds).transacting(trx)
    .then( () => {
      return knex('jewels').where({user_id, jeweltype_id: 0 }).increment('total_count', diamonds).transacting(trx);
    })
    .then( () => {
      return knex('achievementusers').where({ id: a_id }).increment( 'level', 5).transacting(trx);
    })
    .then( trx.commit)
    .catch(trx.rollback)

  })
  .then( () => {
    return res.json({ error:false, percent: 100 });
  })
  .catch(err => {
    next(err);
  });
  

  
}

task.redeemAchievement = function(req, res, next) {

  let a_id = req.body.id;
  let user_id = req.session.user.id;

  let level, id, phone;

  knex('achievementusers').where({ id: a_id }).select()
  .then( achi => {

    id = achi[0].achievement_id;
    level = achi[0].level;

    return knex('users').where({ id: req.session.user.id }).select(); 

  })
  .then( user => {

    phone = user[0].phone;    

    return knex('scores').where({ user_id }).select(); 

  })
  .then( score => {

    if(score[0].level< level)
      throw new Error('Illegal action');

    
    switch(id){

      case 1: return knex('invite').where({user_id}).count( 'invitee as i' );
      case 2: return knex('jewels').where({user_id, jeweltype_id: 2}).select('total_count');
      case 3: return knex('jewels').where({user_id, jeweltype_id: 3}).select('total_count');
      case 4: return knex('jewels').where({user_id, jeweltype_id: 4}).select('total_count');
      case 5: return knex('jewels').where({user_id, jeweltype_id: 5}).select('total_count');
      case 6: return knex('jewels').where({user_id, jeweltype_id: 6}).select('total_count');
      case 7: return knex('jewels').where({user_id, jeweltype_id: 7}).select('total_count');
      case 8: return knex('jewels').where({user_id, jeweltype_id: 8}).select('total_count');
      case 9: return knex('jewels').where({user_id, jeweltype_id: 9}).select('total_count');
      case 10: return knex('jewels').where({user_id, jeweltype_id: 10}).select('total_count');
      case 11: return knex('jewels').where({user_id, jeweltype_id: 11}).select('total_count');
      case 12: return knex('jewels').where({user_id, jeweltype_id: 12}).select('total_count');
      case 13: return knex('jewels').where({user_id, jeweltype_id: 13}).select('total_count');
      case 14: return knex('jewels').where({user_id, jeweltype_id: 14}).select('total_count');
      case 15: return knex('jewels').where({user_id, jeweltype_id: 15}).select('total_count');
      case 16: return knex('jewels').where({user_id, jeweltype_id: 16}).select('total_count');
      case 17: return knex('jewels').where({user_id, jeweltype_id: 17}).select('total_count');

      case 18: return knex('users').where( 'users.reference' , phone )
                  .join('scores', 'users.id', '=', 'scores.user_id')
                  .andWhere( 'scores.level', '>=', 5 )
                  .count('users.id as ref');

      case 19: return knex('users').where( 'users.reference' , phone )
                  .join('scores', 'users.id', '=', 'scores.user_id')
                  .andWhere( 'scores.level', '>=', 10 )
                  .count('users.id as ref');

      case 20: return knex('users').where( 'users.reference' , phone )
                  .join('scores', 'users.id', '=', 'scores.user_id')
                  .andWhere( 'scores.level', '>=', 15 )
                  .count('users.id as ref');
                  
      case 21: return knex('users').where( 'users.reference' , phone )
                  .join('scores', 'users.id', '=', 'scores.user_id')
                  .andWhere( 'scores.level', '>=', 20 )
                  .count('users.id as ref');
                  
      case 22: return knex('users').where( 'users.reference' , phone )
                  .join('scores', 'users.id', '=', 'scores.user_id')
                  .andWhere( 'scores.level', '>=', 25 )
                  .count('users.id as ref');

      case 23: return knex('users').where( 'users.reference' , phone )
                  .join('scores', 'users.id', '=', 'scores.user_id')
                  .andWhere( 'scores.level', '>=', 30 )
                  .count('users.id as ref');

      case 24: return knex('users').where( 'users.reference' , phone )
                  .join('scores', 'users.id', '=', 'scores.user_id')
                  .andWhere( 'scores.level', '>=', 40 )
                  .count('users.id as ref');
                  
      case 25: return knex('users').where( 'users.reference' , phone )
                  .join('scores', 'users.id', '=', 'scores.user_id')
                  .andWhere( 'scores.level', '>=', 50 )
                  .count('users.id as ref');
                  
      case 26: return knex('users').where( 'users.reference' , phone )
                  .join('scores', 'users.id', '=', 'scores.user_id')
                  .andWhere( 'scores.level', '>=', 60 )
                  .count('users.id as ref');
                                                                                          
      case 27: return knex('users').where( 'users.reference' , phone )
                  .join('scores', 'users.id', '=', 'scores.user_id')
                  .andWhere( 'scores.level', '>=', 70 )
                  .count('users.id as ref');
                              
      case 28: return knex('users').where( 'users.reference' , phone )
                  .join('scores', 'users.id', '=', 'scores.user_id')
                  .andWhere( 'scores.level', '>=', 80 )
                  .count('users.id as ref');
      case 29: return knex('users').where( 'users.reference' , phone )
                  .join('scores', 'users.id', '=', 'scores.user_id')
                  .andWhere( 'scores.level', '>=', 90 )
                  .count('users.id as ref');
      
      case 30: return knex('users').where( 'users.reference' , phone )
                  .join('scores', 'users.id', '=', 'scores.user_id')
                  .andWhere( 'scores.level', '>=', 100 )
                  .count('users.id as ref');

      case 31: return knex('users').where( 'users.reference' , phone )
                  .join('scores', 'users.id', '=', 'scores.user_id')
                  .andWhere( 'scores.level', '>=', 110 )
                  .count('users.id as ref');
      
      case 32: return knex('users').where( 'users.reference' , phone )
                  .join('scores', 'users.id', '=', 'scores.user_id')
                  .andWhere( 'scores.level', '>=', 120 )
                  .count('users.id as ref');                                                                                                                 

    }


  })
  .then( val => {

    let percent;

    switch(id){

      case 1: {
          if(val[0].i < (level)){
            percent = ( val[0].i * 100 )/ level;
            return res.json({ error: false, percent })
          }
          else complete_achievement(1, a_id, user_id,req, res, next);

          break;
      }
      case 2:{
          if(val[0].i < (level)){
            percent = ( val[0].i * 100 )/ level;
            return res.json({ error: false, percent })
          }
          else complete_achievement(1, a_id, user_id,req, res, next);

          break;
      }
      case 3:{
          if(val[0].total_count < (level * 10)){
            percent = ( val[0].total_count * 100 )/ (level * 10);
            return res.json({ error: false, percent })
          }
          else complete_achievement(1, a_id, user_id,req, res, next);

          break;
      }
      case 4:{
          if(val[0].total_count < (level * 10)){
            percent = ( val[0].total_count * 100 )/ (level * 10);
            return res.json({ error: false, percent })
          }
          else complete_achievement(1, a_id, user_id,req, res, next);

          break;
      }
      case 5:{
          if(val[0].total_count < (level * 10)){
            percent = ( val[0].total_count * 100 )/ (level * 10);
            return res.json({ error: false, percent })
          }
          else complete_achievement(1, a_id, user_id,req, res, next);

          break;
      }
      case 6:{
          if(val[0].total_count < (level * 10)){
            percent = ( val[0].total_count * 100 )/ (level * 10);
            return res.json({ error: false, percent })
          }
          else complete_achievement(1, a_id, user_id,req, res, next);

          break;
      }
      case 7:{
          if(val[0].total_count < (level * 10)){
            percent = ( val[0].total_count * 100 )/ (level * 10);
            return res.json({ error: false, percent })
          }
          else complete_achievement(1, a_id, user_id,req, res, next);

          break;
      }
      case 8:{
          if(val[0].total_count < (level * 10)){
            percent = ( val[0].total_count * 100 )/ (level * 10);
            return res.json({ error: false, percent })
          }
          else complete_achievement(1, a_id, user_id,req, res, next);

          break;
      }
      case 9:{
          if(val[0].total_count < (level * 10)){
            percent = ( val[0].total_count * 100 )/ (level * 10);
            return res.json({ error: false, percent })
          }
          else complete_achievement(1, a_id, user_id,req, res, next);

          break;
      }      
      case 10:{
          if(val[0].total_count < (level * 10)){
            percent = ( val[0].total_count * 100 )/ (level * 10);
            return res.json({ error: false, percent })
          }
          else complete_achievement(1, a_id, user_id,req, res, next);

          break;
      }
      case 11:{
          if(val[0].total_count < (level * 10)){
            percent = ( val[0].total_count * 100 )/ (level * 10);
            return res.json({ error: false, percent })
          }
          else complete_achievement(1, a_id, user_id,req, res, next);

          break;
      }
      case 12:{
          if(val[0].total_count < (level * 10)){
            percent = ( val[0].total_count * 100 )/ (level * 10);
            return res.json({ error: false, percent })
          }
          else complete_achievement(1, a_id, user_id,req, res, next);

          break;
      }
      case 13:{
          if(val[0].total_count < (level * 10)){
            percent = ( val[0].total_count * 100 )/ (level * 10);
            return res.json({ error: false, percent })
          }
          else complete_achievement(1, a_id, user_id,req, res, next);

          break;
      }
      case 14:{
          if(val[0].total_count < (level * 10)){
            percent = ( val[0].total_count * 100 )/ (level * 10);
            return res.json({ error: false, percent })
          }
          else complete_achievement(1, a_id, user_id,req, res, next);

          break;
      }
      case 15:{
          if(val[0].total_count < (level * 10)){
            percent = ( val[0].total_count * 100 )/ (level * 10);
            return res.json({ error: false, percent })
          }
          else complete_achievement(1, a_id, user_id,req, res, next);

          break;
      }
      case 16:{
          if(val[0].total_count < (level * 10)){
            percent = ( val[0].total_count * 100 )/ (level * 10);
            return res.json({ error: false, percent })
          }
          else complete_achievement(1, a_id, user_id,req, res, next);

          break;
      }
      case 17:{
          if(val[0].total_count < (level * 10)){
            percent = ( val[0].total_count * 100 )/ (level * 10);
            return res.json({ error: false, percent })
          }
          else complete_achievement(1, a_id, user_id,req, res, next);

          break;
      }
      case 18:{
          if(val[0].ref < (level)){
            percent = ( val[0].ref * 100 )/ (level);
            return res.json({ error: false, percent })
          }
          else complete_achievement(2, a_id, user_id,req, res, next);

          break;
      }
      case 19:{
          if(val[0].ref < (level)){
            percent = ( val[0].ref * 100 )/ (level);
            return res.json({ error: false, percent })
          }
          else complete_achievement(2, a_id, user_id,req, res, next);

          break;
      }
      case 20:{
          if(val[0].ref < (level)){
            percent = ( val[0].ref * 100 )/ (level);
            return res.json({ error: false, percent })
          }
          else complete_achievement(2, a_id, user_id,req, res, next);

          break;
      }
      case 21:{
          if(val[0].ref < (level)){
            percent = ( val[0].ref * 100 )/ (level);
            return res.json({ error: false, percent })
          }
          else complete_achievement(2, a_id, user_id,req, res, next);

          break;
      }
      case 22:{
          if(val[0].ref < (level)){
            percent = ( val[0].ref * 100 )/ (level);
            return res.json({ error: false, percent })
          }
          else complete_achievement(2, a_id, user_id,req, res, next);

          break;
      }
      case 23:{
          if(val[0].ref < (level)){
            percent = ( val[0].ref * 100 )/ (level);
            return res.json({ error: false, percent })
          }
          else complete_achievement(1, a_id, user_id,req, res, next);

          break;
      }
      case 24:{
          if(val[0].ref < (level)){
            percent = ( val[0].ref * 100 )/ (level);
            return res.json({ error: false, percent })
          }
          else complete_achievement(1, a_id, user_id,req, res, next);

          break;
      }
      case 25:{
          if(val[0].ref < (level)){
            percent = ( val[0].ref * 100 )/ (level);
            return res.json({ error: false, percent })
          }
          else complete_achievement(1, a_id, user_id,req, res, next);

          break;
      }
      case 26:{
          if(val[0].ref < (level)){
            percent = ( val[0].ref * 100 )/ (level);
            return res.json({ error: false, percent })
          }
          else complete_achievement(1, a_id, user_id,req, res, next);

          break;
      }
      case 27:{
          if(val[0].ref < (level)){
            percent = ( val[0].ref * 100 )/ (level);
            return res.json({ error: false, percent })
          }
          else complete_achievement(1, a_id, user_id,req, res, next);

          break;
      }
      case 28:{
          if(val[0].ref < (level)){
            percent = ( val[0].ref * 100 )/ (level);
            return res.json({ error: false, percent })
          }
          else complete_achievement(1, a_id, user_id,req, res, next);

          break;
      }
      case 29:{
          if(val[0].ref < (level)){
            percent = ( val[0].ref * 100 )/ (level);
            return res.json({ error: false, percent })
          }
          else complete_achievement(1, a_id, user_id,req, res, next);

          break;
      }
      case 30:{
          if(val[0].ref < (level)){
            percent = ( val[0].ref * 100 )/ (level);
            return res.json({ error: false, percent })
          }
          else complete_achievement(1, a_id, user_id,req, res, next);

          break;
      }
      case 31:{
          if(val[0].ref < (level)){
            percent = ( val[0].ref * 100 )/ (level);
            return res.json({ error: false, percent })
          }
          else complete_achievement(1, a_id, user_id,req, res, next);

          break;
      }
      case 32:{
          if(val[0].ref < (level)){
            percent = ( val[0].ref * 100 )/ (level);
            return res.json({ error: false, percent })
          }
          else complete_achievement(1, a_id, user_id,req, res, next);

          break;
      }     

    }

  })  
  .catch( err => {
      next(err);
  })

  
	

};// redeem achievement

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
          return count * 6;
        else if(type==9)
          return count * 4;
        else if(type==10)
          return count * 6;
        else if(type==11)
          return count * 8;
        else if(type==12)
          return count * 6;
        else if(type==13)
          return count * 8;
        else if(type==14)
          return count * 10;
        else if(type==15)
          return count * 8;
        else if(type==16)
          return count * 10;
        else if(type==17)
          return count * 12; 
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

          let jj = []; 


          if(k<2000){

            jj = [3, 6, 3, 6 ,3, 6, 9, 12, 15, 4, 0];

          }else if(k>=2000 && k<3000){

            jj=[3 , 6, 9, 3 , 6, 9, 12, 15, 4, 5, 7, 8, 0];

          }else if(k>=3000 && k<4000){

            jj= [3 , 6, 9, 12, 15, 4, 5, 7, 8, 0, 10, 11];

          }else if(k>=4000){

            jj= [3 , 6, 9, 12, 15, 4, 5, 7, 8, 0, 10, 11, 13, 14, 16, 17]; 

          }



          //jj = [3,6,9,12,15,3,6,9,12,15,3,6,9,12,15,3,6,9,12,15,3,6,9,12,15,3,6,9,12,15,0,4,7,5,8,10,4,7,5,8,10,4,7,5,8,10,4,7,5,8,10,11,13,14,16,17,11,13,14,16,17,0];

          let jt = [];


          let loop  = Math.floor(Math.random() * (5 - 1 + 1)) + 1;

          let sump = 0, sumc = 0, summ=0;  let materials = [];

          for(let i=1; i<=loop;i++){

            let flag=true; let t=0;

            while(flag){

              t = Math.floor(Math.random() * (jj.length - 1 + 1)) + 1;
              flag=false;
              for(let j=0; j<jt.length; j++){
                if(jt[j] == jj[t-1]){
                    flag=true;
                    break;
                  }

              }

              jt.push(jj[t-1]);

            }

            let c = 0;

            if( jj[t-1] == 0)
              c = 1;
            else if( jj[t-1] == 15 || jj[t-1] == 16 || jj[t-1] == 17 )
              c = Math.floor(Math.random() * (2 - 1 + 1)) + 1;
            else if( jj[t-1] == 12 || jj[t-1] == 13 || jj[t-1] == 14 )
              c = Math.floor(Math.random() * (3 - 1 + 1)) + 1;
            else if( jj[t-1] == 9 || jj[t-1] == 10 || jj[t-1] == 11 )
              c = Math.floor(Math.random() * (5 - 1 + 1)) + 1;
            else
              c = Math.floor(Math.random() * (7 - 1 + 1)) + 1;

            sump+=points(jj[t-1],c);
            sumc+= coins(jj[t-1],c);

            materials.push([ jj[t-1], c])    

          }  

          if(sump + sumc >100){
            let x =sump + sumc -100;
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
        
        
        /*
        knex.transaction( trx => {      

                knex('tasks').where({ id: (k+1) }).update({ points: sump, coins:sumc, money:summ }).transacting(trx)
                .then( (id) =>{

                   let a = []; let t;

                   for(let i=0; i<materials.length; i++){
                      //console.log( '>>>>'+id+'::::::'+materials[i][0]+'::::::::'+materials[i][1]);
                      t = knex.table('taskdetails').insert({task_id: (k+1), jeweltype_id: materials[i][0], count: materials[i][1] }).transacting(trx);
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
        
          */


  }        

  return res.json({error: false});

};



