const u = require("../models/userProfiles"); 
const UserProviderServices = require("../models/userProviderServices"); 

exports.getUserAndServices = async (req, res) => {
    try {
        const userData = req.user;
      console.log(userId);
  
      const user = await u.findOne({userId:userData.userId});
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      const services = await UserProviderServices.find({ userId });
  
      return res.status(200).json({
        userProfile: user,
        services: services,
      });
    } catch (error) {
      return res.status(500).json({ message: "Error" });
    }
  };
  exports.getOneUser = async (req, res) => {
    try {
        const {id} = req.params;
     console.log(id);
  
      const user = await u.findOne({userId:id});
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      const services = await UserProviderServices.find({ id });
  
      return res.status(200).json({
        userProfile: user,
        services: services,
      });
    } catch (error) {
      return res.status(500).json(error.message);
    }
  };