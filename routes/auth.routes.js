const express = require('express');
//const router = express.Router();
const router = express.Router();
const authController = require('./../controllers/authController');
const streamingProviderController = require('./../controllers/streamingProviderController');

router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.post('/login', authController.login);
router.post('/sent-otp', authController.sendOTP);
router.post('/signup', authController.signup);

router.get('/stream-provider/getall', streamingProviderController.getAllStreamProvider);
router.get('/stream-provider/getone/:id',streamingProviderController.getOne);
router.post('/stream-provider/create',streamingProviderController.Create);
router.patch('/stream-provider/update/:id',streamingProviderController.Update);
router.post('/stream-provider/delete/:id',streamingProviderController.deleteMe)




module.exports = router