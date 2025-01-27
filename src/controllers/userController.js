const passWordHelpers = require("../helpers/passWordHelpers");
const jwt = require("jsonwebtoken");
const users = require("../models/users");
const sendApproveAccount = require("../helpers/mailHelpers");
const userService = require("../services/userService");
// login user with google
exports.loginGoogle = async (req, res) => {
  try {
    const { user } = req;
    const userIsValid = await users.findById(user._id);
    if (userIsValid.status === false) {
      return res.status(401).json({ message: "Your account is not active" });
    }
    // Tạo access token
    const accessToken = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN, {
      expiresIn: process.env.TOKEN_EXPIRED,
    });
    res.status(200).json({ accessToken, success: true });
  } catch (error) {
    return res.status(401).json({ message: "Lỗi! Vui lòng thử lại.", error });
  }
};
// register user
exports.registerUser = async (req, res) => {
  try {
    const { username, email, password, confirmPassword } = req.body;
    const reg = /^([\w\.\-]+)@([\w\-]+)((\.(\w){2,3})+)*$/;
    const isCheckEmail = reg.test(email);
    if (!username || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    } else if (!isCheckEmail) {
      return res.status(400).json({ message: "Email is invalid" });
    } else if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const respone = await userService.registerUserService(
      username,
      email,
      password
    );
    res.status(200).json(respone);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// login user with email and password
exports.loginLocal = async (req, res) => {
  try {
    const { email, password } = req.body;
    const reg = /^([\w\.\-]+)@([\w\-]+)((\.(\w){2,3})+)*$/;
    const isCheckEmail = reg.test(email);
    // Kiểm tra input
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    } else if (!isCheckEmail) {
      return res.status(400).json({ message: "Email is invalid" });
    }
    const response = await userService.loginLocalService(email, password);
    if (!response.success) {
      return res.status(401).json({ message: response });
    }
    return res.status(200).json({ accessToken: response.accessToken });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await users.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const accessToken = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN, {
      expiresIn: process.env.TOKEN_EXPIRED,
    });
    res.status(200).json({ accessToken });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.approveAccount = async (req, res) => {
  try {
    const { otp, verifyToken } = req.body;
    if (!otp || !verifyToken) {
      return res.status(400).send("Invalid request.");
    }
    // Tìm user theo ID và cập nhật trạng thái
    const respone = await userService.approveAccountService(otp, verifyToken);
    res.status(200).json(respone);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error approving account.");
  }
};
exports.getUser = async (req, res) => {
  try {
    const user = await users.findById(req.user.id);
    res.status(200).json({
      id: user._id,
      email: user.email,
      username: user.username,
      role: user.role,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
