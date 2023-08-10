const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("../models/users");
const UserProfile = require("../models/userProfiles");
const AppError = require("../utils/appError");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");

class ResetTokenStore {
  static store = {};

  static set(token, email) {
    this.store[token] = { email, expires: Date.now() + 10 * 60 * 1000 };
  }

  static get(token) {
    return this.store[token];
  }

  static remove(token) {
    delete this.store[token];
  }
}
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
    const correctPassword = await bcrypt.compare(password, user.password);
    if (!user || !correctPassword) {
      return next(
        new AppError(401, "fail", "Email or Password is wrong"),
        req,
        res,
        next
      );
    }

    const token = createToken(user.id);

    user.password = undefined;

    return res.status(200).json({
      status: "success",
      token,
      data: {
        user,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.signup = async (req, res, next) => {
  try {
    const {
      email,
      password,
      passwordConfirm,
      name,
      birthday,
      address,
      city,
      country,
    } = req.body;

    const e = await UserProfile.findOne({ email });
    if (e) {
      res.status(403).json({
        message: "Email da duoc su dung",
      });
      return;
    }
    if (password != passwordConfirm) {
      res.status(403).json({
        message: "Mat khau xac nhan khong dung",
      });
      return;
    }
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      email: email,
      password: hash,
    });

    const up = await UserProfile.create({
      userId: user._id,
      name: name,
      birthday: birthday,
      address: address,
      city: city,
      country: country,
      zipcode: zipcode,
    });

    const token = createToken(user.id);

    user.password = undefined;

    return res.status(201).json({
      status: "success",
      token,
      data: {
        user,
        up,
      },
    });
  } catch (err) {
    next(err);
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
      return next(
        new AppError(
          401,
          "fail",
          "You are not logged in! Please login in to continue"
        ),
        req,
        res,
        next
      );
    }

    // 2) Verify token
    const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // 3) check if the user is exist (not deleted)
    const user = await User.findById(decode.id);
    if (!user) {
      return next(
        new AppError(401, "fail", "This user is no longer exist"),
        req,
        res,
        next
      );
    }

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(403, "fail", "You are not allowed to do this action"),
        req,
        res,
        next
      );
    }
    next();
  };
};

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: "quandhte@gmail.com",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transporter.sendMail(mailOptions);
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    // 1) Tìm user dựa trên email
    const user = await UserProfile.findOne({ email });
    if (!user) {
      return next(
        new AppError(
          404,
          "fail",
          "Không tìm thấy người dùng với địa chỉ email này"
        )
      );
    }

    const resetToken = Math.floor(100000 + Math.random() * 900000);
    ResetTokenStore.set(resetToken, email);
    console.log(resetToken);
    await sendEmail({
      email: user.email,
      subject: "Yêu cầu đặt lại mật khẩu",
      message: `Ma xac nhan cua ban la: ${resetToken}`,
    });

    res.status(200).json({
      status: "success",
      message: "Mã token đã được gửi đến email của bạn",
    });
  } catch (err) {
    next(err);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword, confirmPassword } = req.body;

    const stored = ResetTokenStore.get(token);

    if (stored && Date.now() < stored.expires) {
      if (confirmPassword === newPassword) {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const user = await UserProfile.findOne({ email: stored.email });
        await User.updateOne(
          { _id: user.userId },
          { password: hashedPassword }
        );
        ResetTokenStore.remove(token);
        res
          .status(200)
          .json({ success: true, message: "Đặt lại mật khẩu thành công" });
      }
      return res.status(403).json({ error: "mật khẩu xác nhận không đúng" });
    } else {
      return res
        .status(403)
        .json({ error: "mã xác nhận không đúng hoặc đã hết hạn" });
    }
  } catch (err) {
    next(err);
  }
};
