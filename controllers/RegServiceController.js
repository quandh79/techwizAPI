const mongoose = require("mongoose");
const ProviderService = require("../models/providerServices"); 
const UserProviderServices = require("../models/userProviderServices"); 
const User = require('../models/users')
const jwt = require("jsonwebtoken");




exports.registerProviderService =  async  (req, res, next)=> {
  try { 
    if (
              req.headers.authorization &&
              req.headers.authorization.startsWith("Bearer")
            ) {
              token = req.headers.authorization.split(" ")[1];
            }
            // 2) Verify token
    const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    const user = await User.findById(decode._id);
    const { serviceId } = req.params;
    const service = await ProviderService.findById(serviceId);

    if (!user || !service) {
      res.status(422).json({
        message: "khong tim thay tai khoan hoac dich vu"
      });
      return
    }
    const currentDate = new Date();
    const numberOfDaysToAdd = 30;
    const renewalDate = new Date(currentDate.getTime() + numberOfDaysToAdd * 24 * 60 * 60 * 1000);
    
    const ps = await UserProviderServices.create({
      name: service.name,
      price: service.price,
      description: service.description,
      SubscriptionDate: currentDate,
      RenewalDate:renewalDate,
      isActive: true,
      streamingProviderId: service.streamingProviderId,
      userId: user._id,
    });

    
    await ps.save();
    

    return res.status(201).json({
        sucess:"dang ky dich vu thanh cong",
        ps:ps
    });
  } catch (err) {
    next(err);
  }
}
