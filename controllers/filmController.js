const film = require("../models/film");

exports.getFilm = async (req, res) => {
  try {
    const { search } = req.body;
    if (search) {
      console.log(search);
      const data = await film.find({
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

    const data = await film.find();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json(err.message);
  }
};
