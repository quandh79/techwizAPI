const express = require('express');
const manageProviderController  = require('../controllers/manageStreamProvider')
const router = express.Router();


router.get('/getall', manageProviderController.getAllStreamProvider);

router.post('/create',manageProviderController.Create);
router.patch('/stream-provider/update/:id',manageProviderController.Update);
router.post('/stream-provider/delete/:id',manageProviderController.deleteMe)
router.post('/upload',manageProviderController.uploadFile);






module.exports = router