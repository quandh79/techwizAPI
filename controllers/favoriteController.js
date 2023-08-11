const Favorites = require("../models/Favorites");
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
  const f = Favorites.findOne({ userId: user.id })
    .then((favorites) => {
      if (!favorites) {
        const newFavorites = new Favorites({ userId: user.id });
        if (data.type === "film") {
          newFavorites.filmId.push(data.id);
        } else if (data.type === "channel") {
          newFavorites.channelId.push(data.id);
        }
        newFavorites.save();
        return res.status(200).json({ message: "Success" });
      } else {
        const itemIndex = favorites[data.type + "Id"].indexOf(data.id);
        if (itemIndex !== -1) {
          favorites[data.type + "Id"].splice(itemIndex, 1);
        } else {
          favorites[data.type + "Id"].push(data.id);
        }
        favorites.save();
        return res.status(200).json({ message: "Success" });
      }
    })
    .catch((err) => {
      res.status(500).json(err.message);
    });
};