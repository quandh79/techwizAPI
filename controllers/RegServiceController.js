const mongoose = require("mongoose");
const UserProviderServices = require("../models/userProviderServices");
const User = require("../models/users");
const jwt = require("jsonwebtoken");
const streamingProviders = require("../models/streamingProviders");
const { promisify } = require("util");
const userProviderServices = require("../models/userProviderServices");

exports.registerProviderService = async (req, res, next) => {
  try {
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    const user = await User.findById(decode.id);
    const { code } = req.body;
    const service = await streamingProviders.findOne({
      packages: { $elemMatch: { code: code } },
    });

    if (!service) {
      return res.status(404).json({ message: "Not Found" });
    }
    const package = await service.packages.filter(
      (pkg) => pkg.code === code
    )[0];
    if (!user || !service) {
      res.status(422).json({
        message: "Not Found user or service",
      });
      return;
    }

    const ps = await UserProviderServices.create({
      name: package.name,
      price: package.price,
      description: package.description,
      streamingProviderId: service.id,
      userId: user._id,
    });

    await ps.save();

    return res.status(201).json({
      message: "Success",
      ps: ps,
    });
  } catch (err) {
    next(err);
  }
};

exports.isActive = async (req, res) => {
  try {
    const { id } = req.body;
    const currentDate = new Date();
    const renewalDate = new Date(
      currentDate.getTime() + 30 * 24 * 60 * 60 * 1000
    );
    const us = await userProviderServices.findById(id);
    if (!us) {
      return res.status(404).json({ message: "Not Found" });
    }
    us.isActive = true;
    (us.SubscriptionDate = currentDate), (us.RenewalDate = renewalDate);
    us.save();
    return res.status(201).json({ message: "success", data: renewalDate });
  } catch (err) {
    return res.status(500).json(err.message);
  }
};
