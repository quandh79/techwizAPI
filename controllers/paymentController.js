const express = require('express');
const ejs = require('ejs');
const paypal = require('paypal-rest-sdk');
const userProfiles = require('../models/userProfiles');
const streamingProviders = require('../models/streamingProviders');
const { protect } = require('./authAdminController');
const { isActive } = require('./RegServiceController');
const router = express.Router();
const UserProviderServices = require("../models/userProviderServices")

paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': 'AW08gKdTJAStrt0PenCcUa-EPaqphhipPcMNjtWKfIoRSHWBt-YRM5bea51ZAiv16baUZQLO2BNCKETw',
    'client_secret': 'EF-_jU1cTmNx1UQHkyl7nq3puKAd2JSAvFSbHxgfGeoNgiXsaW4eQ-PalxcQ5hZHcGJ5kD3sfB-21w7L'
})

router.get('/', async (req, res) => { 
    const{providerId,code} = req.body;
    // const user = req.user


    
    const userData = await userProfiles.findOne({userId:"64d53b5a0d5f7061e7b3d145"});
    const providerData= await streamingProviders.findById("64d4c7f09ef9f5dc7191b3af");
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
    debugger
    const create_payment_json = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": "http://localhost:3000/success",
            "cancel_url": "http://localhost:3000/cancel"
        },
        "transactions": [{
            "item_list": {
                "items": [{
                    "name": "Iphone 5S",
                    "sku": "002",
                    "price": "26.00",
                    "currency": "USD",
                    "quantity": 1
                }]
            },
            "amount": {
                "currency": "USD",
                "total": "1100.00"
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

    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;
    const {id} = req.ps._id
    console.log(req.ps)
    console.log(id)

    const execute_payment_json = {
        "payer_id": payerId,
        "transactions": [{
            "amount": {
                "currency": "USD",
                "total": "26.00"
            }
        }]
    };
    paypal.payment.execute(paymentId, execute_payment_json, function(error, payment) {
        if (error) {
            console.log(error.response);
            throw error;
        } else {
            console.log(JSON.stringify(payment));
             isActive(id)
            res.render('../views/success');
        }
    });
});

router.get('/cancel',(req,res) => res.render('../views/cancel'));
module.exports = router
