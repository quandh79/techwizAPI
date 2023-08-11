const express = require('express');
const router = express.Router();
//const router = require('express-promise-router')()
const authController = require('./../controllers/authController');
const usermanage = require("../controllers/ManageUserController");
const authAdminController = require('../controllers/authAdminController');
const managePv = require('../controllers/manageStreamProvider')

const multer = require("multer");
// chon thu muc muon luu anh
const storage = multer.diskStorage({
    destination: function (req,file,cb){
        cb(null,'/uploads/streamprovider');
    },
    filename: function (req,file,cb){
        cb(null,Date.now()+"-"+file.originalname);
    }
});
const upload = multer({storage:storage});

router.post('/login', authAdminController.login);
router.post('/signup', authAdminController.signup);


//Protect all routes after this middleware
//router.use(authController.protect);

router.delete('/deleteMe', usermanage.deleteMe);

// Only admin have permission to access for the below APIs 
//router.use(authAdminController.restrictTo('admin'));

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

router.get('/stream-provider/getall', managePv.getAllStreamProvider);
router.get('/stream-provider/getone/:id',managePv.getOne);
router.post('/stream-provider/create',managePv.Create);
router.patch('/stream-provider/update/:id',managePv.Update);
router.post('/stream-provider/delete/:id',managePv.deleteMe)

module.exports = router;



