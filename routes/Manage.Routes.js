const express = require('express');
const router = express.Router();
//const router = require('express-promise-router')()
const usermanage = require("../controllers/ManageUserController");
const authAdminController = require('../controllers/authAdminController');
const manageStreamProvider = require('../controllers/manageStreamProvider')



router.post('/login', authAdminController.login);
router.post('/signup', authAdminController.signup);


//Protect all routes after this middleware
//router.use(authController.protect);

router.delete('/deleteMe', usermanage.deleteMe);

// Only admin have permission to access for the below APIs 
//router.use(authAdminController.restrictTo('admin'));

// manage user
router
    .route('/getAllUsers')
    .get(usermanage.getAllUsers);


// router
//     .route('/user/:id')
//     .get(usermanage.getUser)
//     .patch(usermanage.updateUser)
//     .delete(usermanage.deleteUser);

    router.get('/get-user-id/:id', usermanage.getUser)


    // manage streamProder

router.get('/getall-provider', manageStreamProvider.getAllStreamProvider);
router.get('/stream-provider/:id',manageStreamProvider.getOne);
router.post('/stream-provider/create',manageStreamProvider.Create);
router.patch('/stream-provider/update/:id',manageStreamProvider.Update);
router.post('/stream-provider/delete/:id',manageStreamProvider.deleteMe)

module.exports = router;



