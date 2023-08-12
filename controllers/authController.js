const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("../models/users");
const UserProfile = require("../models/userProfiles");
const AppError = require("../utils/appError");
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const bcrypt = require("bcryptjs");
var validator = require('validator');

const otp = async () => {
  const resetToken = Math.floor(100000 + Math.random() * 900000);
  const currentTime = new Date();
  const limitedTime = new Date(currentTime.getTime() + 30 * 60000);
  return { resetToken, limitedTime };
};
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
    const { email, password } = req.body;

    // 1) check if email and password exist
    if (!email || !password) {
      return next(
        new AppError(404, "fail", "Please provide email or password"),
        req,
        res,
        next,
      );
    }

    // 2) check if user exist and password is correct
    const user = await User.findOne({
      email,
    });
  
    if (!user) {
      return res.status(404).json({ message: "Not Found" });
    }
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

  
    const token = createToken(user.id);

    user.password = undefined;

    res.status(200).json({
      status: "success",
      token,
      
    });
  } catch (err) {
    res.status(500).json(err.message)
  }
};

exports.signup = async (req, res, next) => {
  try {
    
    const e = await User.findOne({email:req.body.email});
    if(e){
      res.status(422).json({
        message:"Email da duoc su dung"
      })
      return
    }
   
    if(req.body.password != req.body.passwordConfirm){return res.status(422).json({
      message:"Mat khau xac nhan khong dung"
    })
     
  }
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(req.body.password,salt); 
    
    const user = await User.create({
      email: req.body.email,
      password: hash,
      
    });
    
    
    const up = await UserProfile.create({
      userId: user._id,
      name:req.body.name,
      birthday:req.body.birthday,
      address:req.body.address,
      city:req.body.city,
      country:req.body.country,
     

    })

    const token = createToken(user.id);

    user.password = undefined;
    user.UserProfile = up
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
exports.sendOTP = async (req,res,next) =>{
  try{
      const { email } = req.body;
      const c = await User.findOne({email:email});
    if(c){
      return  res.status(422).json({
        message:"Email da duoc su dung"
      });
    };
      
    
      const e = validator.isEmail(email);
 
      if(!e){
        return  res.status(422).json({
          message:"Email khong hop le"
        });
        
      };
      // gen otp
      const data = await otp()
      
      
      
         sendEmail({
          email: email,
          subject: 'Yêu cầu đăng ký tài khoản',
          message: `Ma xac nhan cua ban la: ${data.resetToken}`,
        });
       
         
      

        return res.status(200).json({
              data})
  
  }catch(err){
    res.status(500).json(err.message)
  }
}
exports.updateProfile = async(req,res) => {
  try{
    const {name, tel, birthday,address,city,country} = req.body
  const user = await req.user
  const userId = {userId:user.id}
  const update = {
    name,
    tel,
    birthday,
    address,
    city,
    country
  }
  await UserProfile.findOneAndUpdate(userId,update)
  const profile = await UserProfile.findOne({userId:user.id})
  return res.status(201).json({message:"Success",data:profile})
  }catch(err){
    res.status(500).json(err.message)
  }
}

exports.getProfile = async(req,res) =>{
  try{
    const user = await req.user
    console.log(user)
  const profile = await UserProfile.findOne({userId:user._id}).populate('userId')
  return res.status(200).json({
    data:{
      profile
    }
  })
  }catch(err){
res.status(500).json(err.message)
  }
}

exports.delete = async (req,res) => {
  try{
const {password} = req.body
const user = await req.user
const correctPassword = await bcrypt.compare(password, user.password)
if(!correctPassword) {
  return res.status(400),json({message:"Password wrong"})
}
await UserProfile.findOneAndDelete({userId:user.id})
await User.findByIdAndDelete(user.id)
return res.status(200).json({message:"Success"})
  }catch(err){
    res.status(500).json(err.message)
  }
}
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
    const user = await UserProfile.findOne({ email:email });
    if (!user) {
      return next(
        new AppError(
          404,
          "fail",
          "Không tìm thấy người dùng với địa chỉ email này"
        )
      );
    }

    const data =await otp();
    ResetTokenStore.set(resetToken, email);
    console.log(resetToken);
    await sendEmail({
      email: user.email,
      subject: "Yêu cầu đặt lại mật khẩu",
      message: `Ma xac nhan cua ban la: ${data.resetToken}`,
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
    const {  newPassword, confirmPassword } = req.body;
      if (confirmPassword === newPassword) {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await UserProfile.findOneAndUpdate({ email: stored.email ,password: hashedPassword });
        res
          .status(200)
          .json({ success: true, message: "Đặt lại mật khẩu thành công" });
      }
      res.status(403).json({ error: "mật khẩu xác nhận không đúng" });
    
  } catch (err) {
    res.status(500).json(err.message)
  }
};
