const express = require('express');
//const router = express.Router();
const router = express.Router();
const authController = require('./../controllers/authController');



router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.post('/login', authController.login);
router.post('/sent-otp', authController.sendOTP);
router.post('/signup', authController.signup);




//Route Admin







module.exports = router