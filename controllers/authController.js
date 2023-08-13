const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("../models/users");
const UserProfile = require("../models/userProfiles");
const AppError = require("../utils/appError");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
var validator = require("validator");

const otp = async () => {
  const resetToken = Math.floor(100000 + Math.random() * 900000);
  const currentTime = new Date();
  const limitedTime = new Date(currentTime.getTime() + 30 * 60000);
  return { resetToken, limitedTime };
};
const createToken = (id) => {
  return jwt.sign(
    {
      id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
const deviceToken = req.headers['device-token']
    // 1) check if email and password exist
    if (!email || !password) {
      return next(
        new AppError(404, "fail", "Please provide email or password"),
        req,
        res,
        next
      );
    }

    // 2) check if user exist and password is correct
    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(404).json({ message: "Not Found" });
    }
    const correctPassword = await bcrypt.compare(password, user.password);
    console.log(correctPassword);
    if (!user || !correctPassword) {
      return next(
        new AppError(401, "fail", "Email or Password is wrong"),
        req,
        res,
        next
      );
    }

    const token = createToken(user.id);
     user.token = token;
     user.deviceToken = deviceToken;
await user.save()
    user.password = undefined;

    res.status(200).json({
      status: "success",
      token,
    });
  } catch (err) {
    res.status(500).json(err.message);
  }
};

exports.changePassword = async (req, res) => {
  try {
    const user = req.user;
    const { oldPassword, newPassword, confirmPassword } = req.body;
    const correctPassword = await bcrypt.compare(oldPassword, user.password);
    if (!correctPassword) {
      return res.status(400).json({ message: "Old password wrong" });
    }
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Confirm wrong" });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.save();
    return res.status(201).json({ message: "Success" });
  } catch (err) {
    res.status(500).json(err.message);
  }
};

exports.signup = async (req, res, next) => {
  try {
    const e = await User.findOne({ email: req.body.email });
    if (e) {
      res.status(422).json({
        message: "Email da duoc su dung",
      });
      return;
    }

    if (req.body.password != req.body.passwordConfirm) {
      return res.status(422).json({
        message: "Mat khau xac nhan khong dung",
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(req.body.password, salt);

    const user = await User.create({
      email: req.body.email,
      password: hash,
    });

    const up = await UserProfile.create({
      userId: user._id,
      name: req.body.name,
      birthday: req.body.birthday,
      address: req.body.address,
      city: req.body.city,
      country: req.body.country,
    });

    const token = createToken(user.id);

    user.password = undefined;
    user.UserProfile = up;
    res.status(201).json({
      status: "success",
      token,
      data: {
        user:up
      },
    });
  } catch (err) {
    next(err);
  }
};
exports.sendOTP = async (req, res, next) => {
  try {
    const { email } = req.body;
    const c = await User.findOne({ email: email });
    if (c) {
      return res.status(422).json({
        message: "Email da duoc su dung",
      });
    }

    const e = validator.isEmail(email);

    if (!e) {
      return res.status(422).json({
        message: "Email khong hop le",
      });
    }
    // gen otp
    const data = await otp();
    const htmlContent = `
    <html>
    <body>
      <div style="word-spacing: normal; font-family: 'IBM Plex Sans', sans-serif">
        <div>
          <div style="margin: 0px auto; max-width: 600px; background-color: #ffe6ea;">
            <div class="m_515302627557219584mj-column-per-100" style="width: 50%">
              <table cellpadding="0" cellspacing="0" width="100%">
                <tbody>
                  <tr>
                    <td
                      style="
                        font-size: 0px;
                        padding: 22px 6px 0px 14px;
                        word-break: break-word;
                      "
                    >
                      <a
                        href="/"
                        class="css-5k1n1y"
                        style="
                          text-decoration: none;
                          display: flex;
                          align-items: center;
                        "
                      >
                        <img src="https://appserviceccc.azurewebsites.net/uploads/logomail.png" alt="logo" width="100%" />
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div style="padding: 16px 6px 20px 16px">
              <h2 style="margin: 0">Learn more about your new account</h2>
            </div>
          </div>
          <div style="margin: 0px auto; max-width: 600px; padding-bottom: 10px; background-color: #ffe6ea99;">
            <table style="width: 100%">
              <tbody>
                <tr>
                  <td
                    style="
                      direction: ltr;
                      font-size: 0px;
                      padding: 10px 32px 36px 16px;
                      text-align: center;
                    "
                  >
                    <div style="margin: 0px auto; max-width: 536px; margin-bottom: 12px;">
                      <table cellpadding="0" cellspacing="0" style="width: 100%">
                        <tbody>
                          <tr>
                            <td
                              style="
                                direction: ltr;
                                font-size: 0px;
                                padding: 0;
                                text-align: center;
                              "
                            >
                              <div
                                class="m_515302627557219584mj-column-per-100"
                                style="
                                  font-size: 0;
                                  line-height: 0;
                                  text-align: left;
                                  display: inline-block;
                                  width: 100%;
                                  direction: ltr;
                                "
                              >
                                <div
                                  class="m_515302627557219584mj-column-per-100"
                                  style="
                                    font-size: 0px;
                                    text-align: left;
                                    direction: ltr;
                                    display: inline-block;
                                      vertical-align: top;
                                      width: 100%;
                                    "
                                  >
                                    <table
                                      cellpadding="0"
                                      cellspacing="0"
                                      width="100%"
                                    >
                                      <tbody>
                                        <tr>
                                          <td
                                            style="
                                              font-size: 0px;
                                              padding: 0;
                                              word-break: break-word;
                                            "
                                          >
                                            <div
                                              style="
                                                font-size: 14px;
                                                line-height: 20px;
                                                text-align: left;
                                                /* color: #3a2a2c; */
                                              "
                                            >
                                              
                                              <span
                                                style="
                                                  font-weight: 700;
                                                  color: #9155fd;
                                                "
                                                ></span
                                              >
                                            </div>
                                          </td>
                                        </tr>
                                        <tr>
                                          <td
                                            style="
                                              font-size: 0px;
                                              padding: 0;
                                              word-break: break-word;
                                            "
                                          >
                                            <div
                                              style="
                                                font-size: 14px;
                                                line-height: 20px;
                                                text-align: left;
                                                /* color: #3a2a2c; */
                                              "
                                            >
                                              We're excited to have you get started
                                              at the Stream Master. First, you need
                                              to confirm your account.
                                            </div>
                                          </td>
                                        </tr>
                                        <tr>
                                          <td
                                            style="
                                              font-size: 0px;
                                              padding: 0;
                                              word-break: break-word;
                                            "
                                          >
                                            <div
                                              style="
                                                font-size: 14px;
                                                line-height: 20px;
                                                text-align: left;
                                                /* color: #3a2a2c; */
                                              "
                                            >
                                              OTP:
                                              <span style="color: #9155fd"
                                                >${data.resetToken}</span
                                              >
                                            </div>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          </tbody>
    
                          <tbody>
                            <tr>
                              <td
                                style="
                                  direction: ltr;
                                  padding: 12px 0;
                                  text-align: center;
                                "
                              >
                                <div
                                  style="
                                    font-size: 14px;
                                    line-height: 20px;
                                    /* color: #3a2a2c; */
                                  "
                                >
                                  <!-- <button
                                    type="submit"
                                    style="
                                      width: 99%;
                                      background-color: #ff0808;
                                      color: #fff;
                                      padding: 12px;
                                      font-size: 16px;
                                      font-weight: bold;
                                      outline: none;
                                      border: none;
                                      border-radius: 4px;
                                    "
                                  >
                                    Đặt lại mật khẩu
                                  </button> -->
                                </div>
                              </td>
                            </tr>
                          </tbody>
    
                          <tbody>
                            <tr>
                              <td style="vertical-align: top; padding: 0">
                                <table cellpadding="0" cellspacing="0" width="100%">
                                  <tbody>
                                    <tr>
                                      <td
                                        style="
                                          font-size: 0px;
                                          padding: 0;
                                          word-break: break-word;
                                        "
                                      >
                                        <div
                                          style="height: 12px; line-height: 12px"
                                        >
                                         
                                        </div>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td
                                        style="
                                          font-size: 0px;
                                          padding: 0;
                                          word-break: break-word;
                                        "
                                      >
                                        <div
                                          style="
                                            font-size: 12px;
                                            line-height: 18px;
                                            text-align: left;
                                            /* color: #3a2a2c; */
                                          "
                                        >
                                          We're excited to have you get started at
                                          the Stream Master. First, you need to
                                          confirm your account. Just press the
                                          button below.
                                        </div>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          </tbody>
                          <tbody>
                            <tr>
                              <td
                                style="
                                  font-size: 0px;
                                  padding: 0;
                                  word-break: break-word;
                                "
                              >
                                <div style="height: 12px; line-height: 12px">
                                  â€Š
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td
                                style="
                                  font-size: 0px;
                                  padding: 0;
                                  word-break: break-word;
                                "
                                >
                                <div
                                  style="
                                    font-size: 14px;
                                    line-height: 18px;
                                    text-align: left;
                                    font-weight: bold;
                                  "
                                >
                                StreamMaster Team
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td
                                style="
                                  font-size: 0px;
                                  padding-top: 4px;
                                  word-break: break-word;
                                "
                              >
                                <div
                                  style="
                                    font-size: 14px;
                                    line-height: 20px;
                                    text-align: left;
                                    /* color: #3a2a2c; */
                                  "
                                >
                                  
    We're sending this email because you've signed up for an account
    StreamMaster account.
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <hr/>
                      <div style="
                      font-size: 14px;
                      line-height: 20px;
                      text-align: left;
                      color: #00000085;
                      padding: 10px 0;
                    ">
                        You have questions? Please visit...
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
              <!-- <div style="display: flex; justify-content: center">
              <button style="padding: 10px 30px; background-color: #9155fd; border: none; margin: 0px 15px">
                <a href="" style="text-decoration: none; color: white">
                  <strong>Go to Ticket</strong>
                </a>
              </button>
            </div> -->
            
            </div>
          </div>
        </div>
    </body>
  </html>`;

    sendEmail({
      email: email,
      subject: "Requires account registration",
      html: htmlContent,
    });

    return res.status(200).json({
      data,
    });
  } catch (err) {
    res.status(500).json(err.message);
  }
};
exports.updateProfile = async (req, res) => {
  try {
    const { name, tel, birthday, address, city, country } = req.body;
    const user = await req.user;
    const userId = { userId: user.id };
    const update = {
      name,
      tel,
      birthday,
      address,
      city,
      country,
    };
    await UserProfile.findOneAndUpdate(userId, update);
    const profile = await UserProfile.findOne({ userId: user.id });
    return res.status(201).json({ message: "Success", data: profile });
  } catch (err) {
    res.status(500).json(err.message);
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await req.user;
    console.log(user);
    const profile = await UserProfile.findOne({ userId: user._id }).select(
      "-_id -__v -userId"
    );
    console.log(profile);
    return res.status(200).json({
      data: {
        ...profile.toObject(),
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json(err.message);
  }
};

exports.delete = async (req, res) => {
  try {
    const { password } = req.body;
    const user = await req.user;
    const correctPassword = await bcrypt.compare(password, user.password);
    if (!correctPassword) {
      return res.status(400).json({ message: "Password wrong" });
    }
    await UserProfile.findOneAndDelete({ userId: user.id });
    await User.findByIdAndDelete(user.id);
    return res.status(200).json({ message: "Success" });
  } catch (err) {
    res.status(500).json(err.message);
  }
};
exports.protect = async (req, res, next) => {
  try {
    // 1) check if the token is there
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
    const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    const user = await User.findById(decode.id);
    if (!user) {
      return res
        .status(401)
        .json({ message: "This user is no longer exist", req, res });
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(500).json(err.message);
  }
};

//
// exports.restrictTo = (...roles) => {
//   return (req, res, next) => {
//     if (!roles.includes(req.user.role)) {
//       return next(
//         new AppError(403, "fail", "You are not allowed to do this action"),
//         req,
//         res,
//         next,
//       );
//     }
//     next();
//   };
// };

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: "mailto:quandhte@gmail.com",
    to: options.email,
    subject: options.subject,
    text: options.message,
    html:options.html
  };

  await transporter.sendMail(mailOptions);
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    // 1) Tìm user dựa trên email
    const user = await User.findOne({ email: email });
    if (!user) {
      return next(
        new AppError(
          404,
          "fail",
          "Không tìm thấy người dùng với địa chỉ email này"
        )
      );
    }

    const data = await otp();
    // ResetTokenStore.set(resetToken, email);
    // console.log(resetToken);
    const htmlContent = `
    <html>
    <body>
      <div style="word-spacing: normal; font-family: 'IBM Plex Sans', sans-serif">
        <div>
          <div style="margin: 0px auto; max-width: 600px; background-color: #ffe6ea;">
            <div class="m_515302627557219584mj-column-per-100" style="width: 50%">
              <table cellpadding="0" cellspacing="0" width="100%">
                <tbody>
                  <tr>
                    <td
                      style="
                        font-size: 0px;
                        padding: 22px 6px 0px 14px;
                        word-break: break-word;
                      "
                    >
                      <a
                        href="/"
                        class="css-5k1n1y"
                        style="
                          text-decoration: none;
                          display: flex;
                          align-items: center;
                        "
                      >
                        <img src="https://appserviceccc.azurewebsites.net/uploads/logomail.png" alt="logo" width="100%" />
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div style="padding: 16px 6px 20px 16px">
              <h2 style="margin: 0">Learn more about your new account</h2>
            </div>
          </div>
          <div style="margin: 0px auto; max-width: 600px; padding-bottom: 10px; background-color: #ffe6ea99;">
            <table style="width: 100%">
              <tbody>
                <tr>
                  <td
                    style="
                      direction: ltr;
                      font-size: 0px;
                      padding: 10px 32px 36px 16px;
                      text-align: center;
                    "
                  >
                    <div style="margin: 0px auto; max-width: 536px; margin-bottom: 12px;">
                      <table cellpadding="0" cellspacing="0" style="width: 100%">
                        <tbody>
                          <tr>
                            <td
                              style="
                                direction: ltr;
                                font-size: 0px;
                                padding: 0;
                                text-align: center;
                              "
                            >
                              <div
                                class="m_515302627557219584mj-column-per-100"
                                style="
                                  font-size: 0;
                                  line-height: 0;
                                  text-align: left;
                                  display: inline-block;
                                  width: 100%;
                                  direction: ltr;
                                "
                              >
                                <div
                                  class="m_515302627557219584mj-column-per-100"
                                  style="
                                    font-size: 0px;
                                    text-align: left;
                                    direction: ltr;
                                    display: inline-block;
                                      vertical-align: top;
                                      width: 100%;
                                    "
                                  >
                                    <table
                                      cellpadding="0"
                                      cellspacing="0"
                                      width="100%"
                                    >
                                      <tbody>
                                        <tr>
                                          <td
                                            style="
                                              font-size: 0px;
                                              padding: 0;
                                              word-break: break-word;
                                            "
                                          >
                                            <div
                                              style="
                                                font-size: 14px;
                                                line-height: 20px;
                                                text-align: left;
                                                /* color: #3a2a2c; */
                                              "
                                            >
                                              
                                              <span
                                                style="
                                                  font-weight: 700;
                                                  color: #9155fd;
                                                "
                                                ></span
                                              >
                                            </div>
                                          </td>
                                        </tr>
                                        <tr>
                                          <td
                                            style="
                                              font-size: 0px;
                                              padding: 0;
                                              word-break: break-word;
                                            "
                                          >
                                            <div
                                              style="
                                                font-size: 14px;
                                                line-height: 20px;
                                                text-align: left;
                                                /* color: #3a2a2c; */
                                              "
                                            >
                                              We're excited to have you get started
                                              at the Stream Master. First, you need
                                              to confirm your account.
                                            </div>
                                          </td>
                                        </tr>
                                        <tr>
                                          <td
                                            style="
                                              font-size: 0px;
                                              padding: 0;
                                              word-break: break-word;
                                            "
                                          >
                                            <div
                                              style="
                                                font-size: 14px;
                                                line-height: 20px;
                                                text-align: left;
                                                /* color: #3a2a2c; */
                                              "
                                            >
                                              OTP:
                                              <span style="color: #9155fd"
                                                >${data.resetToken}</span
                                              >
                                            </div>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          </tbody>
    
                          <tbody>
                            <tr>
                              <td
                                style="
                                  direction: ltr;
                                  padding: 12px 0;
                                  text-align: center;
                                "
                              >
                                <div
                                  style="
                                    font-size: 14px;
                                    line-height: 20px;
                                    /* color: #3a2a2c; */
                                  "
                                >
                                  <!-- <button
                                    type="submit"
                                    style="
                                      width: 99%;
                                      background-color: #ff0808;
                                      color: #fff;
                                      padding: 12px;
                                      font-size: 16px;
                                      font-weight: bold;
                                      outline: none;
                                      border: none;
                                      border-radius: 4px;
                                    "
                                  >
                                    Đặt lại mật khẩu
                                  </button> -->
                                </div>
                              </td>
                            </tr>
                          </tbody>
    
                          <tbody>
                            <tr>
                              <td style="vertical-align: top; padding: 0">
                                <table cellpadding="0" cellspacing="0" width="100%">
                                  <tbody>
                                    <tr>
                                      <td
                                        style="
                                          font-size: 0px;
                                          padding: 0;
                                          word-break: break-word;
                                        "
                                      >
                                        <div
                                          style="height: 12px; line-height: 12px"
                                        >
                                         
                                        </div>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td
                                        style="
                                          font-size: 0px;
                                          padding: 0;
                                          word-break: break-word;
                                        "
                                      >
                                        <div
                                          style="
                                            font-size: 12px;
                                            line-height: 18px;
                                            text-align: left;
                                            /* color: #3a2a2c; */
                                          "
                                        >
                                          We're excited to have you get started at
                                          the Stream Master. First, you need to
                                          confirm your account. Just press the
                                          button below.
                                        </div>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          </tbody>
                          <tbody>
                            <tr>
                              <td
                                style="
                                  font-size: 0px;
                                  padding: 0;
                                  word-break: break-word;
                                "
                              >
                                <div style="height: 12px; line-height: 12px">
                                  â€Š
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td
                                style="
                                  font-size: 0px;
                                  padding: 0;
                                  word-break: break-word;
                                "
                                >
                                <div
                                  style="
                                    font-size: 14px;
                                    line-height: 18px;
                                    text-align: left;
                                    font-weight: bold;
                                  "
                                >
                                StreamMaster Team
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td
                                style="
                                  font-size: 0px;
                                  padding-top: 4px;
                                  word-break: break-word;
                                "
                              >
                                <div
                                  style="
                                    font-size: 14px;
                                    line-height: 20px;
                                    text-align: left;
                                    /* color: #3a2a2c; */
                                  "
                                >
                                  
    We're sending this email because you've signed up for an account
    StreamMaster account.
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <hr/>
                      <div style="
                      font-size: 14px;
                      line-height: 20px;
                      text-align: left;
                      color: #00000085;
                      padding: 10px 0;
                    ">
                        You have questions? Please visit...
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
              <!-- <div style="display: flex; justify-content: center">
              <button style="padding: 10px 30px; background-color: #9155fd; border: none; margin: 0px 15px">
                <a href="" style="text-decoration: none; color: white">
                  <strong>Go to Ticket</strong>
                </a>
              </button>
            </div> -->
            
            </div>
          </div>
        </div>
    </body>
  </html>`;
    await sendEmail({
      email: user.email,
      subject: "Yêu cầu đặt lại mật khẩu",
      html: htmlContent,
    });

    res.status(200).json({
      data,
      status: "success",
      message: "Mã token đã được gửi đến email của bạn",
    });
  } catch (err) {
    next(err);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { newPassword, confirmPassword } = req.body;
    if (confirmPassword === newPassword) {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await UserProfile.findOneAndUpdate({
        email: stored.email,
        password: hashedPassword,
      });
      res
        .status(200)
        .json({ success: true, message: "Đặt lại mật khẩu thành công" });
    }
    res.status(403).json({ error: "mật khẩu xác nhận không đúng" });
  } catch (err) {
    res.status(500).json(err.message);
  }
};
