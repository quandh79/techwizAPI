const Product = require("../models/product");
const Provider = require("../models/streamingProviders");
const favorite = require("../models/favorite");
exports.createProduct = async (req, res) => {
  try {
    const { name, category, description, providers, thumbnail, actor } =
      req.body;
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
      actor,
    });
    res.status(201).json({
      message: "tao chanel thanh cong",
      data,
    });
  } catch (err) {
    return res.status(500).json(err.message);
  }
};
exports.getProduct = async (req, res) => {
  try {
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 10;
    const skip = (page - 1) * limit;
    console.log(req.query);

    const totalProviders = await Product.countDocuments();
    const totalPages = Math.ceil(totalProviders / limit);

    const { providerId } = req.params;
    console.log(providerId);
    if (providerId) {
      const data = await Product.find({
        providers: { $elemMatch: { id: providerId } },
      })
        .skip(skip)
        .limit(limit);
      if (!data) {
        return res.status(404).json({ message: "Not Found" });
      }
      return res.status(200).json(data);
    }

    const data = await Product.find().skip(skip).limit(limit);
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json(err.message);
  }
};

exports.getProductProviders = async (req, res) => {
  try {
    const user = req.user;
    const { productId } = req.body;
    let isProductSaved = false;
    const product = await Product.findById(productId);
    const populateProduct = await Product.find({ category: product.category });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    const fav = await favorite.findOne({
      userId: user.id,
    });
    for (const p of fav.productId) {
      console.log(p.toString() === productId);
      if (p.toString() === productId) {
        product.isSave = true;
        await product.save();
        isProductSaved = true;
        break;
      }
    }
    if (!isProductSaved) {
      product.isSave = false;
      await product.save();
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

    return res.status(200).json({
      data: {
        product,
        provider: pro,
        populateProduct,
      },
    });
  } catch (error) {
    return res.status(500).json(error.message);
  }
};
