var express = require('express');
var router = express.Router();

var passport = require('passport');

var passportUtils = require('../utils/passport');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({ message : 'hello'});
});


router.post('/register', function(req, res, next) {
  
	var phone = req.body.phone;
	var name = req.body.name;

	console.log(phone+':::'+name);

	res.json({message : 'register'});

});


router.post('/login', function(req, res, next) {
  
	passport.authenticate('local', function(err, user, info) {
        if (err) res.status(500).json({ 'success' : false, data: err});
        
        req.logIn(user, function(err) {      
            if (err) res.status(500).json({ 'success' : false, data: err});

            var curr_time = new Date().getTime();
            //console.log(user);
            return res.json({ 'success' : true, 'request': 'verifyCode', 'user': user, 'time': curr_time }); 
        });
		    
    })(req, res, next);

});


router.post('/dashboard', passportUtils.isAuthenticated ,function(req, res, next) {
  
	res.json({message : 'dashboard'});

});	


module.exports = router;
