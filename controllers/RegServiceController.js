const mongoose = require("mongoose");
const UserProviderServices = require("../models/userProviderServices");
const User = require("../models/users");
const jwt = require("jsonwebtoken");
const streamingProviders = require("../models/streamingProviders");
const { promisify } = require("util");

exports.registerProviderService = async (req, res, next) => {
  try {
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    console.log(token);
    // 2) Verify token
    const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    console.log(decode);
    const user = await User.findById(decode.id);
    console.log(user);
    const { code } = req.body;
    console.log(code);
    const service = await streamingProviders.findOne({
      packages: { $elemMatch: { code: code } },
    });

    console.log(service);
    const package = await service.packages.filter(
      (pkg) => pkg.code === code
    )[0];
    console.log(package);
    if (!user || !service) {
      res.status(422).json({
        message: "khong tim thay tai khoan hoac dich vu",
      });
      return;
    }
    const currentDate = new Date();
    const renewalDate = new Date(
      currentDate.getTime() + 30 * 24 * 60 * 60 * 1000
    );

    const ps = await UserProviderServices.create({
      name: package.name,
      price: package.price,
      description: package.description,
      SubscriptionDate: currentDate,
      RenewalDate: renewalDate,
      isActive: true,
      streamingProviderId: service.id,
      userId: user._id,
    });

    await ps.save();

    return res.status(201).json({
      sucess: "dang ky dich vu thanh cong",
      ps: ps,
    });
  } catch (err) {
    next(err);
  }
};
