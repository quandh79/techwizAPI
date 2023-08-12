const express = require('express');
const ejs = require('ejs');
const paypal = require('paypal-rest-sdk');
const userProfiles = require('../models/userProfiles');
const streamingProviders = require('../models/streamingProviders');
const { protect } = require('./authAdminController');
const { isActive } = require('./RegServiceController');
const router = express.Router();
const UserProviderServices = require("../models/userProviderServices")
const BASE_URL = process.env.BASE_URL;

paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': 'AXVhMtt0o6nZ5XI-NJHdM9Jzerkg2ln1XZ9c7qmp2VVvtIPFMhApTU_wUumG2kqUCRY3n_20UBbUqjZH',
    'client_secret': 'ENR3gDRecvDCf2k9imwW2VyvP662n3AYD1WhzmDcZl_aGotYMay4jtd0kfAp6fKE6BlUOEVGjQAWkfp1'
})

router.get('/paypal', async (req, res) => { 
    const{providerId,code,userId} = req.query;//?id=bbbb&
    // const user = t


    
    const userData = await userProfiles.findOne({userId:userId});
    const providerData= await streamingProviders.findById(providerId);
    const packageData = await providerData.packages.filter(
        (pkg) => pkg.code === "ba"
      )[0];
      console.log(userData)
      console.log(providerData)
      console.log(packageData)
      
      const ps = await UserProviderServices.create({
        name: packageData.name,
        price: packageData.price,
        description: packageData.description,
        streamingProviderId: providerData.id,
        userId: userData.id,
      });
      console.log(ps)

 res.render('../views/index', {userData, providerData, packageData,ps})});



router.get('/pay', (req, res) => {
    console.log(req.query);
    const{amount} = req.query;
    const{psId} =req.query;
   
    var am = parseInt(amount);
    am = isNaN(am)?0:am;
    const create_payment_json = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": `${BASE_URL}/success?psId=${psId}`,
            "cancel_url": `${BASE_URL}/cancel`
        },
        "transactions": [{
            "amount": {
                "currency": "USD",
                "total": am+".00"
            },
            "description": "Iphone 5S cũ giá siêu rẻ"
        }]
    };
    console.log("a");
    paypal.payment.create(create_payment_json, function (error, payment) {
        // console.log("b");
        if (error) {
            console.log(error);
         //   throw error;
        //  res.send("err");
        } else {
          
            for (let i = 0; i < payment.links.length; i++) {
              
                if (payment.links[i].rel == 'approval_url') {
                    console.log('yes');
                    res.redirect(301,payment.links[i].href);
                    return;
                }
            }

        }
    });
    // console.log("c");
});

router.get('/success', (req, res) => {
    const{psId}=req.query;
    isActive(psId)
    res.render('success');

});

router.get('/cancel',(req,res) => res.render('../views/cancel'));
module.exports = router
