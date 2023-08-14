const Favorites = require("../models/favorite");
const product = require("../models/product");
const users = require("../models/users");

exports.getFavorites = async (req, res) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      return res.status(401).json({
        message: "You are not logged in! Please login in to continue",
        req,
        res,
      });
    }
    console.log(token);
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 5;
    const skip = (page - 1) * limit;
    const user = await users.findOne({ token });
    console.log(user);
    const totalFavorites = await Favorites.countDocuments({ userId: user._id });
    const totalPages = Math.ceil(totalFavorites / limit);

    const favorites = await Favorites.findOne({ userId: user._id })
      .populate("productId")
      .select("-_id -userId -__v");
    // .skip(skip)
    // .limit(limit);

    if (!favorites) {
      return res
        .status(404)
        .json({ message: "Favorites not found for this user." });
    }
    return res.status(200).json(favorites);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

exports.create = async (req, res) => {
  const user = req.user;

  const { data } = req.body;
  console.log(data);
  const f = Favorites.findOne({ userId: user.id })
    .then((favorites) => {
      if (!favorites) {
        const newFavorites = new Favorites({ userId: user.id });
        newFavorites.productId.push(data);
        newFavorites.save();
        return res.status(200).json({ message: "Success" });
      } else {
        const itemIndex = favorites.productId.indexOf(data);
        if (itemIndex !== -1) {
          favorites.productId.splice(itemIndex, 1);
        } else {
          favorites.productId.push(data);
        }
        favorites.save();
        return res.status(200).json({ message: "Success" });
      }
    })
    .catch((err) => {
      res.status(422).json(err.message);
    });
};
