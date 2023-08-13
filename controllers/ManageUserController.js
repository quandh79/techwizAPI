const UserProfile = require("../models/userProfiles");
const User = require("../models/users");
const base = require("./baseController");

const userProfile = require("../models/userProfiles");
const UserProviderServices = require("../models/userProviderServices");

exports.deleteMe = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user.id, {
      active: false,
    });

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const data = await userProfile.find().populate("userId");

    res.status(200).json({
      message: "Success",
      data,
    });
  } catch (error) {
    next(error);
  }
};
exports.getOneUser = async (req, res) => {
  try {
    const { id } = req.query;
    console.log(id);

    const user = await UserProfile.findOne({ userId: id });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const services = await UserProviderServices.find({ userId: id });

    return res.status(200).json({
      data: {
        userProfile: user,
        services: services,
      },
    });
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

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

// exports.getAll = Model => async (req, res, next) => {
//   try {
//       const features = new APIFeatures(Model.find(), req.query)
//           .sort()
//           .paginate();

//       const doc = await features.query;

//       res.status(200).json({
//           status: 'success',
//           results: doc.length,
//           data: {
//               data: doc
//           }
//       });

//   } catch (error) {
//       next(error);
//   }

// };
