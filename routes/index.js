var express = require('express');
var router = express.Router();

var passport = require('passport');

var passportUtils = require('../utils/passport');

var controller = require('../controllers');



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


router.get('/getRegisteredContacts', controller.contacts.getRegisteredContacts);
router.get('/getProfile', controller.contacts.getProfile);
router.get('/getUserProfile', controller.contacts.getUserProfile);
router.post('/addPic', controller.contacts.addPic);
router.post('/updateProfilePic', controller.contacts.updateProfilePic);
router.post('/updateProfileStatus', controller.contacts.updateProfileStatus);

router.post('/getGroups', controller.groups.getGroups);

router.post('/createGroups', controller.groups.createGroups);
router.post('/addNewMembers', controller.groups.addNewMembers);
router.post('/leaveGroup', controller.groups.leaveGroup);

router.post('/getAllGroupChatMessages', controller.chats.getAllGroupChatMessages );
router.post('/getAllChatMessages', controller.chats.getAllChatMessages );

router.post('/getTasks', controller.task.getTasks);
router.post('/getTaskElements', controller.task.getTaskElements)
router.post('/redeemTask', controller.task.redeemTask);
router.post('/getAchievements', controller.task.getAchievements);
router.post('/redeemAchivement', controller.task.redeemAchivement);

router.post('/pickJewel', controller.game.pickJewel);
router.post('/getGameState', controller.game.getGameState);

router.post('/getFactories', controller.game.getFactories);
router.post('/getFactoryMaterials', controller.game.getFactoryMaterials);
router.post('/startFactory', controller.game.startFactory);
router.post('/stopFactory', controller.game.stopFactory);
router.post('/getJewelFromFactory', controller.game.getJewelFromFactory);

router.post('/getMarket', controller.game.getMarket);
router.post('/getMyShop', controller.game.getMyShop);
router.post('/addToShop', controller.game.addToShop);
router.post('/getUserShop', controller.game.getUserShop);

router.post('/getWallet', controller.wallet.getWallet );
router.post('/redeemMoney', controller.wallet.redeemMoney);
router.post('/buyDiamonds', controller.wallet.buyDiamonds);
router.post('/buyCoins', controller.wallet.buyCoins);



	


module.exports = router;
