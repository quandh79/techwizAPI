const feedback = require("../models/feedback");
const userProviderServices = require("../models/userProviderServices");
const { promises } = require("nodemailer/lib/xoauth2");
const userProfiles = require("../models/userProfiles");
const streamingProviders = require("../models/streamingProviders");

exports.createFeedback = async (req, res) => {
  try {
    const { providerId, content } = req.body;
    const user = req.user;
    const us = await userProviderServices.findOne({
      userId: user.id,
      providerId,
    });
    if (!us) {
      return res.status(400).json({
        message: "You haven't subscribed to this service so can't reply",
      });
    }
    const newFeedback = await feedback.create({
      userId: user.id,
      providerId,
      content,
    });
    return res.status(201).json({ message: "Thank you for your feedback" });
  } catch (err) {
    res.status(500).json(err.message);
  }
};

exports.getActive = async (req, res) => {
  try {
    const listFeedback = await feedback.find({ isActive: true });
    if (listFeedback.length < 1) {
      return res.status(404).json({ message: "Not Found" });
    }
    return res.status(200).json({ data: listFeedback });
  } catch (err) {
    res.status(500).json(err.message);
  }
};

exports.get = async (req, res) => {
  try {
    const f =await feedback.find()
    if(!f) {return res.status(404).json({message:"Not Found"})}
    let data =[]
    await Promise.all(
      f.map(async (item) => {
        const user = await userProfiles.findOne({ userId: { $in: item.userID } });
        const pro = await streamingProviders.findOne({ _id: { $in: item.providerID } });
        const user_provider = { user: user.name, provider: pro.name };
        const itemObject = item.toObject(); 
        itemObject.user_provider = await user_provider; 
        data = data.concat(itemObject)
        return itemObject;
      }),
)
res.status(200).json(data)
  } catch (err) {
    res.status(500).json(err.message);
  }
};

exports.Active = async (req, res) => {
  try {
    const { id } = req.params;
    const fb = await feedback.findOne({userID:id});
    if (!fb) {
      return res.status(400).json({ message: "No response found or deleted" });
    }
    fb.isActive = true;
    fb.save();
    return res.status(201).json({ message: "Success" });
  } catch (err) {
    res.status(500).json(err.message);
  }
};

exports.delete = async (req, res) => {
  try {
    //const user = req.params;
    const { id } = req.params;
    console.log(id)
    // const fb = await feedback.findById(id);
    // if (!fb) {
    //   return res.status(404).json({ message: "Not Found" });
   // }
    // if (fb.userID !== user.id) {
    //   return res.status(400).json({
    //     message: "You do not have permission to edit or delete this reply",
    //   });
    // }
   const c =  await feedback.findByIdAndDelete(id);
  
    console.log(c)
    res.status(200).json({ message: "Feedback deleted successfully" });
  } catch (err) {
    res.status(500).json(err.message);
  }
};

exports.update = async (req, res) => {
  try {
    const user = req.user;

    const { id, content } = req.body;
    const fb = await feedback.findById(id);
    if (!fb) {
      return res.status(404).json({ message: "Not Found" });
    }
    if (fb.userID !== user.id) {
      return res.status(400).json({
        message: "You do not have permission to edit or delete this reply",
      });
    }
    fb.content = content;
    fb.save();
    res.status(200).json({ message: "Feedback update successfully" });
  } catch (err) {
    res.status(500).json(err.message);
  }
};
