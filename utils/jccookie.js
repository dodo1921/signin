'use strict';

let signature = require('cookie-signature');

let cook = require('cookie');

module.exports = {

	cookie: function(req, res, next) {
		
		var signed = 's:' + signature.sign( req.session.user.id + '::::' + req.session.user.scode , 'ilovescotchscotchyscotchscotch');
	  var data = cook.serialize('connect.sid', signed, {});  

	  var prev = res.getHeader('jc-cookie') || [];
	  var header = Array.isArray(prev) ? prev.concat(data) : [prev, data];

	  res.setHeader('jc-cookie', header);

	  next();
  	
	}


};
