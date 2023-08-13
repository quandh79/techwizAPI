const admin = require("firebase-admin");
var serviceAccountKey = require("../techwiz-the-new-star-firebase-adminsdk-j32nb-ed07d6ac77.json");
const User = require("../models/users");

// Khởi tạo Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccountKey),
  databaseURL: "https://techwiz-the-new-star.firebaseio.com",
});

// Hàm API để gửi FCM đến client
exports.sendFCMNotification = async (req, res) => {
  try {
    const { deviceToken, title, body } = req.body;

    // Kiểm tra xem deviceToken có tồn tại trong bảng users hay không
    const user = await User.findOne({ deviceToken });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Tạo thông báo FCM
    const message = {
      notification: {
        title,
        body,
      },
      token: deviceToken,
    };

    // Gửi thông báo FCM
    const response = await admin.messaging().send(message);

    return res
      .status(200)
      .json({ message: "FCM notification sent successfully", response });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
exports.getDeviceToken = async (req, res) => {
  const user = req.user;
  const deviceToken = req.headers["device-token"];
  console.log("Device Token:", deviceToken);
  user.deviceToken = deviceToken;
  await user.save();
};
