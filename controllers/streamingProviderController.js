const streamingProviders = require("../models/streamingProviders");

exports.getStreamingProviders = async (req, res) => {
  try {
    const data = await streamingProviders.find();
    console.log(data);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Error" });
  }
};

exports.getStreamingProviderByName = async (req, res) => {
  try {
    const { name } = req.body;
    const data = await streamingProviders
      .findOne({ name })
      .populate("serviceId");
    if (!data) {
      res.status(404).json({ message: "Provider is not exists" });
    }
    res.status(200).json({
      data: data,
    });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

exports.getService = async (req, res) => {
  try {
    const { name } = req.params;
    console.log(await streamingProviders.findOne({ name }));
    const data = await streamingProviders
      .findOne({ name })
      .select("packages -_id");
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json(err.message);
  }
};
