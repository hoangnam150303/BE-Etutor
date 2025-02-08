const User = require("../models/users");
const passWordHelpers = require("../helpers/passWordHelpers");
const mailHelpers = require("../helpers/mailHelpers");
const jwt = require("jsonwebtoken");
const users = require("../models/users");

exports.loginLocalService = async (email, password) => {
  try {
    if (!email || !password) {
      throw new Error("All fields are required");
    }

    const user = await User.findOne({ email, authProvider: "local" });

    if (!user) {
      throw new Error("User not found");
    }

    const isMatch = await passWordHelpers.comparePassword(
      password,
      user.password
    );
    if (!isMatch) {
      throw new Error("Invalid credentials");
    }

    if (user.status === false) {
      throw new Error("Your account is not active");
    }
    const accessToken = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN, {
      expiresIn: process.env.TOKEN_EXPIRED,
    });
    user.lastLogin = new Date();
    await user.save();
    return { accessToken, success: true };
  } catch (error) {
    return error.message;
  }
};

exports.registerUserService = async (username, email, password) => {
  try {
    const user = await User.findOne({ email, authProvider: "local" });
    if (user) {
      throw new Error("User already exists");
    }
    // Tạo OTP và mã hóa thông tin
    const otp = Math.floor(1000 + Math.random() * 90000).toString(); // OTP 5 chữ số
    const verifyToken = jwt.sign(
      { password, username, email, otp },
      process.env.ENCRYPTION_KEY,
      {
        expiresIn: process.env.VERIFY_TOKEN_EXPIRED,
      }
    );
    // Gửi OTP qua email
    await mailHelpers.sendApproveAccount(email, username, otp); // Gửi OTP tới email của user

    return { verifyToken };
  } catch (error) {
    throw new Error(error.message); // Quản lý lỗi
  }
};

exports.approveAccountService = async (otpInput, verifyToken) => {
  try {
    const decoded = jwt.verify(verifyToken, process.env.ENCRYPTION_KEY);
    const { email, username, password, otp } = decoded;

    if (otpInput !== otp) {
      throw new Error("Invalid OTP");
    }
    const hashPassword = await passWordHelpers.hashPassword(password, 10);
    await User.create({
      email,
      username,
      password: hashPassword,
      authProvider: "local",
      status: true,
      role: "Admin",
    });
    return { message: "Account approved successfully" };
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.sendOTPForgotPasswordService = async (email, newPassword) => {
  try {
    const user = await User.findOne({ email, authProvider: "local" });
    if (!user) {
      throw new Error("User not found");
    }
    const otp = Math.floor(1000 + Math.random() * 90000).toString(); // OTP 5 chữ số
    const verifyToken = jwt.sign(
      { email, newPassword, otp },
      process.env.ENCRYPTION_KEY,
      {
        expiresIn: process.env.VERIFY_TOKEN_EXPIRED,
      }
    );

    // Gửi OTP qua email
    await sendApproveAccount(email, username, otp); // Gửi OTP tới email của user

    return { verifyToken };
  } catch (error) {
    throw new Error(error.message); // Quản lý lỗi
  }
};

exports.forgotPasswordService = async (otpInput, verifyToken) => {
  try {
    const user = await User.findOne({ email, authProvider: "local" });
    if (!user) {
      throw new Error("User not found");
    }
    const hashPassword = await passWordHelpers.hashPassword(newPassword, 10);
    user.password = hashPassword;
    await user.save();
    return { message: "Password reset successfully" };
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.getAllUserService = async (filter) => {
  try {
    let filterOptions = {};
    switch (filter) {
      case "isDeleted":
        filterOptions = { status: false };
        break;
      case "isActive":
        filterOptions = { isDeleted: true };
        break;
      case "tutor":
        filterOptions = { role: { $regex: /^Tutor$/i } };
        break;
      case "student":
        filterOptions = { role: { $regex: /^Student$/i } };
        break;
      default:
        filterOptions = {};
        break;
    }
    const Users = await users
      .find(filterOptions)
      .sort({ createdAt: -1 })
      .select("-password")
      .where("role")
      .ne("Admin");

    return { success: true, Users };
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.createTutorAccountService = async (
  email,
  username,
  password,
  phoneNumber,
  image
) => {
  try {
    const tutor = await users.findOne({
      email,
      authProvider: "local",
      role: "Tutor",
    });
    if (tutor) {
      throw new Error("Tutor already exists");
    }
    const hashPassword = await passWordHelpers.hashPassword(password, 10);
    await users.create({
      email,
      username,
      password: hashPassword,
      authProvider: "local",
      status: true,
      role: "Tutor",
      phoneNumber,
      image,
    });
    return { success: true };
  } catch (error) {
    throw new Error(error.message);
  }
};
