var express = require('express');
var router = express.Router();

var passport = require('passport');

var passportUtils = require('../utils/passport');

var controllers = require('../controllers');



/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({ message : 'hello'});
});


router.post('/registerPhoneNumber', controller.registration.registerPhoneNumber);
router.post('/verifyCode', controller.registration.verifyCode);
router.post('/initialDetails', controller.registration.initialDetails);
router.get('/resendVcode', controller.registration.resendVcode);
router.post('/inviteUser', controller.registration.inviteUser);
router.post('/updateGcmToken', controller.registration.updateGcmToken);
router.get('/getChildren', controller.registration.getChildren);

router.post('/uploadContacts', controller.contacts.uploadContacts );
router.get('/getRegisteredContacts', controller.contacts.getRegisteredContacts);
router.get('/getProfile', controller.contacts.getProfile);
router.get('/getUserProfile', controller.contacts.getUserProfile);
router.post('/addPic', controller.contacts.addPic);
router.post('/updateProfilePic', controller.contacts.updateProfilePic);
router.post('/updateProfileStatus', controller.contacts.updateProfileStatus);

router.get('/getGroups', controller.groups.getGroups);

router.post('/createGroups', controller.groups.createGroups);
router.post('/addNewMembers', controller.groups.addNewMembers);
router.post('/leaveGroup', controller.groups.leaveGroup);



router.get('/getAllMessages', controller.chats.getAllMessages );




router.get('/getTasks', controller.task.getTasks);
router.get('/getTaskElements', controller.task.getTaskElements)
router.get('/redeemTask', controller.task.redeemTask);
router.get('/getAchievements', controller.task.getAchievements);
router.get('/redeemAchivement', controller.task.redeemAchivement);

router.post('/pickJewel', controller.game.pickJewel);
router.get('/getGameState', controller.game.getGameState);

router.get('/getFactories', controller.game.getFactories);
router.get('/startFactory', controller.game.startFactory);
router.get('/stopFactory', controller.game.stopFactory);
router.get('/getJewelFromFactory', controller.game.getJewelFromFactory);



router.get('/getMarket', controller.game.getMarket);
router.get('/getMyShop', controller.game.getMyShop);
router.get('/addToShop', controller.game.addToShop);
router.get('/getUserShop', controller.game.getUserShop);

router.get('/getWallet', controller.wallet.getWallet );
router.get('/redeemMoney', controller.wallet.redeemMoney);
router.get('/buyDiamonds', controller.wallet.buyDiamonds);
router.get('/buyCoins', controller.wallet.buyCoins);



router.post('/register', function(req, res, next) {
  
	var phone = req.body.phone;	

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
