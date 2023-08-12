const Favorites = require("../models/favorite");
exports.get = async (req, res) => {
  try {
    const user = req.user;
    const data = await Favorites.findOne({ userId: user.id });
    if (!data) {
      return res.status(404).json({ message: "Not Found" });
    }
    return res.status(200).json({
      data,
    });
  } catch (err) {
    res.status(500).json(err.message);
  }
};

exports.create = async (req, res) => {
  const user = req.user;

  const { data } = req.body;
  console.log(data)
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