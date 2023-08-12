const feedback = require("../models/feedback");
const userProviderServices = require("../models/userProviderServices");

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

exporst.get = async (req, res) => {
  try {
    const listFeedback = await feedback.find();
    if (listFeedback.length < 1) {
      return res.status(404).json({ message: "Not Found" });
    }
    return res.status(200).json({ data: listFeedback });
  } catch (err) {
    res.status(500).json(err.message);
  }
};

exports.Active = async (req, res) => {
  try {
    const { id } = req.body;
    const fb = await feedback.findById(id);
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
    const user = req.user;
    const { id } = req.body;
    const fb = await feedback.findById(id);
    if (!fb) {
      return res.status(404).json({ message: "Not Found" });
    }
    if (fb.userID !== user.id) {
      return res.status(400).json({
        message: "You do not have permission to edit or delete this reply",
      });
    }
    await feedback.deleteOne({ _id: id });
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
