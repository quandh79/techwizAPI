const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("../models/users");
const UserProfile = require("../models/userProfiles");
const AppError = require("../utils/appError");
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const bcrypt = require("bcryptjs");
var validator = require('validator');

class authController{
  static security =0
}
const createToken = id => {
  return jwt.sign(
    {
      id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    },
  );
};

exports.login = async (req, res, next) => {
  try {
    const { userName, password } = req.body;

    // 1) check if email and password exist
    if (!userName || !password) {
      return next(
        new AppError(404, "fail", "Please provide email or password"),
        req,
        res,
        next,
      );
    }

    // 2) check if user exist and password is correct
    const user = await User.findOne({
      userName,
    });
const correctPassword = await bcrypt.compare(password, user.password)
console.log(correctPassword)
    if (!user || !correctPassword) {
      return next(
        new AppError(401, "fail", "Email or Password is wrong"),
        req,
        res,
        next,
      );
    }

    // 3) All correct, send jwt to client
    const token = createToken(user.id);

    // Remove the password from the output
    user.password = undefined;

    res.status(200).json({
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
    const u = await User.findOne({userName:req.body.userName});
    if(u){
      res.status(422).json("User name is exists")
      return
    }
   
    if(req.body.password != req.body.passwordConfirm){ res.status(422).json({
      message:"Mat khau xac nhan khong dung"
    })
    return 
  }
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(req.body.password,salt); 
    
    const user = await User.create({
      userName: req.body.userName,
      password: hash,
     
    });
    
    
    const up = await UserProfile.create({
      userId: user._id,
      name:req.body.name,
      email: req.body.email,
      address:req.body.address,
      city:req.body.city,
      country:req.body.country,
      zipcode:req.body.zipcode

    })

    const token = createToken(user.id);

    user.password = undefined;
    user.profile = up
    res.status(201).json({
      status: "success",
      token,
      data: {
        user:user
      },
    });
  } catch (err) {
    await User.findOneAndDelete({userName:req.body.userName})
    next(err);
  }
};
exports.sendOTP = async (req,res,next) =>{
  try{
      const { email } = req.body;
      const e = validator.isEmail(email);
    if(e){
      res.status(422).json({
        message:"Email da duoc su dung"
      })
      return
    }
      if(!e){
        res.status(422).json({
          message:"Email khong hop le"
        })
        return
      }
      // gen otp
      const otp = Math.floor(100000 + Math.random()*900000);
      const u = await User.findOne({email:email});
      
      if(!u){
        await sendEmail({
          email: email,
          subject: 'Yêu cầu đặt lại mật khẩu',
          message: `Ma xac nhan cua ban la: ${otp}`,
        });
        res.status(200).json({
          otp: otp
        })
        return ;
      }
  
  }catch(err){
    next(err);
  }
}



// exports.protect = async (req, res, next) => {
//   try {
//     // 1) check if the token is there
//     let token;
//     if (
//       req.headers.authorization &&
//       req.headers.authorization.startsWith("Bearer")
//     ) {
//       token = req.headers.authorization.split(" ")[1];
//     }
//     if (!token) {
//       return next(
//         new AppError(
//           401,
//           "fail",
//           "You are not logged in! Please login in to continue",
//         ),
//         req,
//         res,
//         next,
//       );
//     }

//     // 2) Verify token
//     const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

//     // 3) check if the user is exist (not deleted)
//     const user = await User.findById(decode.id);
//     if (!user) {
//       return next(
//         new AppError(401, "fail", "This user is no longer exist"),
//         req,
//         res,
//         next,
//       );
//     }

//     req.user = user;
//     next();
//   } catch (err) {
//     next(err);
//   }
// };

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
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: 'quandhte@gmail.com',
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
      return next(new AppError(404, 'fail', 'Không tìm thấy người dùng với địa chỉ email này'));
    }

    // 2) Tạo reset token và lưu vào DB
    // security = Math.floor(100000 + Math.random()*900000);
    // console.log(security)
    // user.resetOTP = security
    // const passwordResetExpires = new Date(new Date().toUTCString()) + 10 * 60 * 1000; // 10 phút
    // console.log(new Date(new Date().toUTCString()))
    // console.log(passwordResetExpires)
    
    user.passwordResetToken = hashedResetToken;
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 phút
    await user.save({ validateBeforeSave: false });
    


    // 4) Gửi email chứa mã token đến địa chỉ email của người dùng
    await sendEmail({
      email: user.email,
      subject: 'Yêu cầu đặt lại mật khẩu',
      message: `Ma xac nhan cua ban la: ${hashedResetToken}`,
    });

    res.status(200).json({
      status: 'success',
      message: 'Mã token đã được gửi đến email của bạn',
    });
  } catch (err) {
    next(err);
  }
};

exports.checkTokenReset = async (req, res, next) =>{
  try{
      const { token } = req.body;
      const tokenReset = User.findOne({passwordResetToken:req.body})
      if(tokenReset){
        return  res.status(200).json({
          success: true,
          message:'ma otp hop le'
        })
        
      }
  }catch(err){
    next(err)
  }
}

exports.resetPassword = async (req, res, next) => {
  try {
    //console.log(security)
    //const { token } = req.query.token;
    //console.log("token 1111",req.query.token)
    const { password, passwordConfirm } = req.body;

    // 1) Giải mã token và kiểm tra tính hợp lệ
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    if (!decodedToken.userId) {
      return next(new AppError(400, 'fail', 'Mã token không hợp lệ'));
    }

    // 2) Tìm user dựa trên userId và kiểm tra xem có hợp lệ để thực hiện reset password
    const user = await User.findById(decodedToken.userId);
    if (!user || !user.passwordResetToken || user.passwordResetToken !== crypto.createHash('sha256').update(token).digest('hex') || user.passwordResetExpires < Date.now()) {
      return next(new AppError(400, 'fail', 'Mã token không hợp lệ hoặc đã hết hạn'));
    }

    // 3) Cập nhật mật khẩu mới và xóa các trường liên quan đến reset password
    user.password = password;
    user.passwordConfirm = passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    res.status(200).json({
      status: 'success',
      message: 'Mật khẩu đã được cập nhật thành công',
    });
  } catch (err) {
    next(err);
  }
};
