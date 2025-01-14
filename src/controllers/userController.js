const passWordHelpers = require("../helpers/passWordHelpers");
const jwt = require("jsonwebtoken");
const users = require("../models/users");
const sendApproveAccount = require("../helpers/mailHelpers");

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
    const { username, email, password, confirmPassWord } = req.body;
    if (!username || !email || !password || !confirmPassWord) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (password !== confirmPassWord) {
      return res.status(400).json({ message: "Passwords do not match" });
    }
    const user = await users.findOne({ email, authProvider: "local" });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }
    if (user.status === false) {
      return res.status(401).json({ message: "Your account is not active" });
    }
    const hash = await passWordHelpers.hashPassword(password, 10);
    await users.create({
      username,
      email,
      password: hash,
      authProvider: "local",
      role: "Student",
      status: false,
    });
    await sendApproveAccount(email, username);
    res.status(201).json({ message: "success" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// login user with email and password
exports.loginLocal = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const user = await users.findOne({ email, authProvider: "local" });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const isMatch = await passWordHelpers.comparePassword(
      password,
      user.password
    );
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    if (user.status === false) {
      return res.status(401).json({ message: "Your account is not active" });
    }
    const accessToken = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN, {
      expiresIn: process.env.TOKEN_EXPIRED,
    });
    user.lastLogin = new Date();
    await user.save();
    res.status(200).json({ accessToken });
  } catch (error) {
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
    const { token } = req.query;
    if (!token) {
      return res.status(400).send("Invalid request.");
    }

    // Giải mã token
    const secretKey = process.env.SECRET_KEY;
    const decoded = jwt.verify(token, secretKey);

    // Tìm user theo ID và cập nhật trạng thái
    const user = await users.findById(decoded.id);
    if (!user) {
      return res.status(404).send("User not found.");
    }

    user.status = true; // Cập nhật trạng thái tài khoản
    await user.save();

    res.send("Your account has been successfully approved!");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error approving account.");
  }
};
exports.getUser = async (req, res) => {
  try {
    const user = await users.findById(req.user.id);
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
