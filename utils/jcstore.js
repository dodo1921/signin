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

          memcached.get(sid , (err, data) =>{

              if(err || data===undefined){

                      this.client('users').where({sessionId: sid})
                      .select()
                      .then( user => {
                        if(user.length>0){
                          memcached.set(sid, user[0], 900, err=>{});
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
                      u.user = data;
                      u.cookie = { originalMaxAge:6000000000000, expires : '2207-07-21T01:27:21.276Z' , httpOnly :false, path :"/" };
                      u.passport = { user: data.id };
                      callback(null, u );
              }

          });    

		    	

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


    	if(sess.passport.user){

        if(sess.user && sess.user.sessionId !== sid){
          console('SET Inside');
	        this.client('users').where({ id: sess.passport.user })
					.update({sessionId: sid })
					.then( () => {
						
							callback(null);
					})
					.catch( err => {
						callback(err);
					});

        }
        else
          callback();  

			}else{
				callback();
			}
		

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
