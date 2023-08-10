const Channel = require("../models/channel");

exports.createChannel = async (req, res) => {
  try {
    const { name, category, description, providers } = req.body;
    const c = await Channel.findOne({ name });
    if (c) {
      return res.status(403).json({ message: "Channel is exist" });
    }
    const data = await Channel.create({
      name,
      category,
      description,
      providers,
    });
  } catch (err) {
    return res.status(500).json(err.message);
  }
};
exports.getChannel = async (req, res) => {
  try {
    const { search } = req.body;
    if (search) {
      console.log(search);
      const data = await Channel.find({
        $or: [
          { name: new RegExp(search, "i") },
          {
            category: new RegExp(search, "i"),
          },
        ],
      });
      if (!data) {
        return res.status(404).json({ message: "Not Found" });
      }
      return res.status(200).json(data);
    }

    const data = await Channel.find();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json(err.message);
  }
};
