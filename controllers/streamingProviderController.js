const streamingProviders = require("../models/streamingProviders");



exports.getStreamingProviders = async (req, res) => {
  try {
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 10;
    const skip = (page - 1) * limit;
const {name} = req.query
    const totalProviders = await streamingProviders.countDocuments();
    const totalPages = Math.ceil(totalProviders / limit);
if(name){
  const providers  = await streamingProviders.findOne({name}).skip(skip).limit(limit);
    const data = providers.map((provider) => {
      const minPrice = provider.packages.reduce(
        (min, package) => (package.price < min ? package.price : min),
        Infinity
      );
      const maxPrice = provider.packages.reduce(
        (max, package) => (package.price > max ? package.price : max),
        -Infinity
      );
      const priceRange = `from $${minPrice} to $${maxPrice}`;
      return {
        ...provider.toObject(),
        priceRange,
      };
    });
    return res.status(200).json({data,totalPages});
}
    const providers  = await streamingProviders.find().skip(skip).limit(limit);
    const data = providers.map((provider) => {
      const minPrice = provider.packages.reduce(
        (min, package) => (package.price < min ? package.price : min),
        Infinity
      );
      const maxPrice = provider.packages.reduce(
        (max, package) => (package.price > max ? package.price : max),
        -Infinity
      );
      const priceRange = `from $${minPrice} to $${maxPrice}`;
      return {
        ...provider.toObject(),
        priceRange,
      };
    });
    return res.status(200).json({data,totalPages});
  } catch (error) {
    return res.status(500).json({ message: "Error" });
  }
};

exports.getStreamingProviderByName = async (req, res) => {
  try {
    const { name } = req.params;
    console.log(name);
    const data = await streamingProviders.findOne({ name });
    if (!data) {
      return res.status(404).json({ message: "Provider is not exists" });
    }
    return res.status(200).json({
      data: data,
    });
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

exports.getService = async (req, res) => {
  try {
    const { name } = req.params;
    console.log(await streamingProviders.findOne({ name }));
    const data = await streamingProviders
      .findOne({ name })
      .select("packages -_id");
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json(err.message);
  }
};

exports.getStreamingProviderById = async (req, res) => {
    try {
      const  { providerId }  = req.body;
      console.log(providerId);
      const data = await streamingProviders.findById(providerId);
      
      if (!data) {
        return res.status(404).json({ message: "Provider is not exists" });
      }
      
      return res.status(200).json({
        data: data,
      });
    } catch (error) {
      return res.status(422).json({ message: "Error" });
    }
  };
