const UserProviderServices = require("../models/userProviderServices");
const streamingProviders = require("../models/streamingProviders");
const userProviderServices = require("../models/userProviderServices");

exports.registerProviderService = async (req, res, next) => {
  try {
    const u = req.user;
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
      userId: u._id,
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

exports.isActive = async (id) => {
  try {
    // const { id } = req.body;
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
exports.get = async (req, res) => {
  try {
    const user = req.user;
    const list = await userProviderServices
      .findOne({ userId: user.id })
      .populate("streamingProviderId");
    return res.status(200).json({
      data: list.length > 0 ? list : [],
    });
  } catch (err) {
    res.status(500).json(err.message);
  }
};
