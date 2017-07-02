'use strict';

let knex = require('../db/knex');

let memcached = require('./memcache');



/**
 * Return the `MemcachedStore` extending `connect`'s session Store.
 *
 * @param {object} session
 * @return {Function}
 * @api public
 */
module.exports = function(session) {
    var Store = session.Store;

    /**
     * Initialize MemcachedStore with the given `options`.
     *
     * @param {Object} options
     * @api public
     */
    function jcstore(options) {
        options = options || {};
        Store.call(this, options);

        this.prefix = options.prefix || '';
        options.client = knex;
                

        this.client = options.client;
    }

    jcstore.prototype.__proto__ = Store.prototype;

    
    

    /**
     * Attempt to fetch session by the given `sid`.
     *
     * @param {String} sid
     * @param {Function} fn
     * @api public
     */
    jcstore.prototype.get = function(sid, callback) {

		    	console.log('GET::::'+sid);

          let parts = sid.split('::::');

          if(parts.length!=2){            
            let u = {};
            u.cookie = { originalMaxAge:6000000000000, expires : '2207-07-21T01:27:21.276Z' , httpOnly :false, path :"/" };
            callback(null, u);
          }
          else{

              memcached.get( parts[0] , (err, data) =>{

                  if(err || data===undefined){

                          this.client('users').where({ id: parts[0], scode: parts[1] })
                          .select( 'id', 'scode', 'online', 'topic', 'token_google', 'is_rooted', 'jewel_block' )
                          .then( user => {
                            if(user.length>0){
                              memcached.set( user[0].id, user[0], 900, err=>{});
                              let u = {};
                              u.user = user[0];
                              u.cookie = { originalMaxAge:6000000000000, expires : '2207-07-21T01:27:21.276Z' , httpOnly :false, path :"/" };
                              u.passport = { user: user[0].id };
                              callback(null, u );
                            }
                            else{
                              let u = {};         
                              u.cookie = { originalMaxAge:6000000000000, expires : '2207-07-21T01:27:21.276Z' , httpOnly :false, path :"/" };
                              callback(null, u);
                            }
                          })
                          .catch( err => {
                            callback(err, null);
                          });



                  }else{
                          let u = {};
                          if(parts[1] === data.scode){
                            u.user = data;
                            u.cookie = { originalMaxAge:6000000000000, expires : '2207-07-21T01:27:21.276Z' , httpOnly :false, path :"/" };
                            u.passport = { user: data.id };
                            callback(null, u );
                          }else{
                            let err = new Error("Session Expired");
                            callback(err, null);
                          }
                  }

              });  

          }      

		    	

	  };

    /**
     * Commit the given `sess` object associated with the given `sid`.
     *
     * @param {String} sid
     * @param {Session} sess
     * @param {Function} fn
     * @api public
     */
    jcstore.prototype.set = function(sid, sess, callback) {

    	console.log( 'SET:::' + sid + '>>>>>' + JSON.stringify(sess) );


    	callback(null);
		

    };

    /**
     * Destroy the session associated with the given `sid`.
     *
     * @param {String} sid
     * @param {Function} fn
     * @api public
     */
    jcstore.prototype.destroy = function(sid, callback) {
        
    };

    /**
     * Fetch number of sessions.
     *
     * @param {Function} fn
     * @api public
     */
    

    /**
     * Clear all sessions.
     *
     * @param {Function} fn
     * @api public
     */
    

	/**
	 * Refresh the time-to-live for the session with the given `sid`.
	 *
	 * @param {String} sid
	 * @param {Session} sess
	 * @param {Function} fn
	 * @api public
 	 */

	jcstore.prototype.touch = function (sid, sess, callback) {
		this.set(sid, sess, callback);
	}


    

    return jcstore;
};
