const Product = require("../models/product");
const Provider = require("../models/streamingProviders");

exports.createProduct = async (req, res) => {
  try {
    const { name, category, description, providers, thumbnail } = req.body;
    const c = await Product.findOne({ name });
    if (c) {
      return res.status(403).json({ message: "Channel is exist" });
    }
    const data = await Product.create({
      name,
      category,
      description,
      providers,
      thumbnail,
    });
    res.status(201).json({
      message: "tao chanel thanh cong",
    });
  } catch (err) {
    return res.status(500).json(err.message);
  }
};
exports.getProduct = async (req, res) => {
  try {
    const { search } = req.body;
    if (search) {
      const data = await Product.find({
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

    const data = await Product.find();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json(err.message);
  }
};

exports.getProductProviders = async (req, res) => {
  try {
    const { productId } = req.body;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    const providers = product.providers;
    let pro = [];
    await Promise.all(
      providers.map(async (item) => {
        const result = await Provider.find({ _id: { $in: item.id } }).populate(
          "packages"
        );

        const filteredPackages = result.map((provider) => ({
          ...provider.toObject(),
          packages: provider.packages.filter(
            (package) => package.code === item.service
          ),
        }));
        pro = pro.concat(filteredPackages);
        return filteredPackages;
      })
    );
    pro.forEach((provider) => {
      return res.status(200).json({
        data: {
          product,
          provider,
        },
      });
    });
  } catch (error) {
    return res.status(500).json(error.message);
  }
};
