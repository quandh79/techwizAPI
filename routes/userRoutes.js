// const express = require('express');
// const router = express.Router();
// //const router = require('express-promise-router')()
// const userController = require('../controllers/userController');
// const authController = require('./../controllers/authController');

// // router.post('/forgot-password', authController.forgotPassword);
// // router.post('/reset-password', authController.resetPassword);
// // router.post('/login', authController.login);
// // router.post('/signup', authController.signup);


// // Protect all routes after this middleware
// //router.use(authController.protect);

// router.delete('/deleteMe', userController.deleteMe);

// // Only admin have permission to access for the below APIs 
// //router.use(authController.restrictTo('admin'));

// router
//     .route('/')
//     .get(userController.getAllUsers);


// router
//     .route('/:id')
//     .get(userController.getUser)
//     .patch(userController.updateUser)
//     .delete(userController.deleteUser);

// module.exports = router;