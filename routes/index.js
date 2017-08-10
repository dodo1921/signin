var express = require('express');
var router = express.Router();

var passport = require('passport');

var passportUtils = require('../utils/passport');

var jccookie = require('../utils/jccookie');

var controller = require('../controllers');

const signature = require('cookie-signature');

var cookie = require('cookie');



/* GET home page. */
router.get('/',  function(req, res, next) {
		//console.log('OMG:::'+req.session.id);		
	console.log();
  	return res.json({ message : 'hello:'+process.env.NODE_ENV+':'+process.env.durl+':'+process.env.dusername });
});


router.post('/registerPhoneNumber', controller.registration.registerPhoneNumber);
router.post('/verifyCode', controller.registration.verifyCode);
router.post('/initialDetails', passportUtils.isAuthenticated, jccookie.cookie ,controller.registration.initialDetails);
router.post('/resendVcode', controller.registration.resendVcode);
router.post('/inviteUser', passportUtils.isAuthenticated, jccookie.cookie ,controller.registration.inviteUser);
router.post('/updateGcmToken', passportUtils.isAuthenticated, jccookie.cookie ,controller.registration.updateGcmToken);
router.get('/getChildren',passportUtils.isAuthenticated, jccookie.cookie , controller.registration.getChildren);
router.get('/getLeaderboard',passportUtils.isAuthenticated, jccookie.cookie , controller.registration.getLeaderboard);
router.get('/getCustomTokenFirebase', passportUtils.isAuthenticated, jccookie.cookie , controller.registration.getCustomTokenFirebase);

router.get('/getRegisteredContacts',passportUtils.isAuthenticated, jccookie.cookie , controller.contacts.getRegisteredContacts);
router.get('/getProfile',passportUtils.isAuthenticated, jccookie.cookie , controller.contacts.getProfile);
router.get('/getUserProfile', passportUtils.isAuthenticated, jccookie.cookie , controller.contacts.getUserProfile);
router.post('/addPic', passportUtils.isAuthenticated, jccookie.cookie , controller.contacts.addPic);
router.post('/updateProfilePic', passportUtils.isAuthenticated, jccookie.cookie , controller.contacts.updateProfilePic);
router.post('/updateProfileStatus', passportUtils.isAuthenticated, jccookie.cookie , controller.contacts.updateProfileStatus);
router.post('/updateProfileName', passportUtils.isAuthenticated, jccookie.cookie , controller.contacts.updateProfileName);
router.post('/downloadContact', passportUtils.isAuthenticated, jccookie.cookie , controller.contacts.downloadContact);
router.post('/downloadContact_Phone', passportUtils.isAuthenticated, jccookie.cookie , controller.contacts.downloadContact_Phone);

router.get('/getGroups', passportUtils.isAuthenticated, jccookie.cookie , controller.groups.getGroups);
router.get('/getBlockedUsers', passportUtils.isAuthenticated, jccookie.cookie , controller.registration.getBlockedUsers);

router.post('/createGroups', passportUtils.isAuthenticated, jccookie.cookie , controller.groups.createGroups);
router.post('/addNewMembers', passportUtils.isAuthenticated, jccookie.cookie , controller.groups.addNewMembers);
router.post('/leaveGroup', passportUtils.isAuthenticated, jccookie.cookie , controller.groups.leaveGroup);

router.post('/getAllGroupChatMessages', passportUtils.isAuthenticated, jccookie.cookie , controller.chats.getAllGroupChatMessages );
router.post('/getAllChatMessages', passportUtils.isAuthenticated, jccookie.cookie , controller.chats.getAllChatMessages );
router.post('/delivery', passportUtils.isAuthenticated, jccookie.cookie , controller.chats.delivery );

router.post('/getTasks', passportUtils.isAuthenticated, jccookie.cookie , controller.task.getTasks);
router.post('/getTaskElements', passportUtils.isAuthenticated, jccookie.cookie , controller.task.getTaskElements)
router.post('/redeemTask', passportUtils.isAuthenticated, jccookie.cookie , controller.task.redeemTask);
router.post('/getAchievements', passportUtils.isAuthenticated, jccookie.cookie , controller.task.getAchievements);
router.post('/redeemAchievement', passportUtils.isAuthenticated, jccookie.cookie , controller.task.redeemAchievement);

router.post('/pickJewel', passportUtils.isAuthenticated, jccookie.cookie , controller.game.pickJewel);
router.post('/getGameState', passportUtils.isAuthenticated, jccookie.cookie , controller.game.getGameState);

router.post('/getFactories', passportUtils.isAuthenticated, jccookie.cookie , controller.game.getFactories);
router.post('/getFactoryMaterials', passportUtils.isAuthenticated, jccookie.cookie , controller.game.getFactoryMaterials);
router.post('/startFactory', passportUtils.isAuthenticated, jccookie.cookie , controller.game.startFactory);
router.post('/stopFactory', passportUtils.isAuthenticated, jccookie.cookie , controller.game.stopFactory);
router.post('/flushFactory', passportUtils.isAuthenticated, jccookie.cookie , controller.game.flushFactory);
router.post('/getJewelFromFactory', passportUtils.isAuthenticated, jccookie.cookie , controller.game.getJewelFromFactory);

router.post('/getMarket', passportUtils.isAuthenticated, jccookie.cookie , controller.game.getMarket);
router.post('/getMyShop', passportUtils.isAuthenticated, jccookie.cookie , controller.game.getMyShop);
router.post('/addToShop', passportUtils.isAuthenticated, jccookie.cookie , controller.game.addToShop);
router.post('/getUserShop', passportUtils.isAuthenticated, jccookie.cookie , controller.game.getUserShop);

router.get('/getWallet', passportUtils.isAuthenticated, jccookie.cookie , controller.wallet.getWallet );
router.post('/redeemMoney', passportUtils.isAuthenticated, jccookie.cookie , controller.wallet.redeemMoney);
router.post('/buyDiamonds', passportUtils.isAuthenticated, jccookie.cookie , controller.wallet.buyDiamonds);
router.post('/buyCoins', passportUtils.isAuthenticated, jccookie.cookie , controller.wallet.buyCoins);

router.get('/generateTasks', controller.task.generateTasks);





	


module.exports = router;
