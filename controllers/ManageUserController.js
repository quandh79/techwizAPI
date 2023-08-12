const User = require('../models/users');
const base = require('./baseController');

const u = require("../models/users"); 
const UserProviderServices = require("../models/userProviderServices"); 


exports.deleteMe = async (req, res, next) => {
    try {
        await User.findByIdAndUpdate(req.user.id, {
            active: false
        });

        res.status(204).json({
            status: 'success',
            data: null
        });


    } catch (error) {
        next(error);
    }
};

exports.getAllUsers = base.getAll(User);
exports.getUser = base.getOne(User);

// Don't update password on this 
exports.updateUser = base.updateOne(User);
exports.deleteUser = base.deleteOne(User);


exports.getUserAndServices = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await u.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const services = await UserProviderServices.find({ userId });

    return res.status(200).json({
      user: user,
      services: services,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error" });
  }
};

exports.getUserAndServicesByName= async (req, res) => {
  try {
    const { name } = req.body;

    const user = await u.findOne({name:name});

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const services = await UserProviderServices.find({ userId:user.id });

    return res.status(200).json({
      user: user,
      services: services,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error" });
  }
};