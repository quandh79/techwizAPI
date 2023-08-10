const express = require('express');
const router = express.Router();
//const router = require('express-promise-router')()
const authController = require('./../controllers/authController');
const usermanage = require("../controllers/ManageUserController");
const authAdminController = require('../controllers/authAdminController');
const streamingProviderController = require('./../controllers/streamingProviderController');


router.post('/login', authAdminController.login);
router.post('/signup', authAdminController.signup);


//Protect all routes after this middleware
router.use(authController.protect);

router.delete('/deleteMe', usermanage.deleteMe);

// Only admin have permission to access for the below APIs 
router.use(authAdminController.restrictTo('admin'));

// manage user
router
    .route('/')
    .get(usermanage.getAllUsers);


router
    .route('/:id')
    .get(usermanage.getUser)
    .patch(usermanage.updateUser)
    .delete(usermanage.deleteUser);


    // manage streamProder

    router.get('/stream-provider/getall', streamingProviderController.getAllStreamProvider);
router.get('/stream-provider/getone/:id',streamingProviderController.getOne);
router.post('/stream-provider/create',streamingProviderController.Create);
router.patch('/stream-provider/update/:id',streamingProviderController.Update);
router.post('/stream-provider/delete/:id',streamingProviderController.deleteMe)

module.exports = router;



