const express = require('express');
const feedbackController  = require('../controllers/manageFeedBackController')
const router = express.Router();


router.get('/getall', feedbackController.get);


router.patch('/active/:id',feedbackController.Active);
router.delete('/delete/:id',feedbackController.delete);






module.exports = router