
const jwt = require("jsonwebtoken");
const users = require("../models/users");
const mailHelpers = require("../helpers/mailHelpers");
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
    const user = await users.findOne({ email: email, authProvider: "local" });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const otp = Math.floor(Math.random() * 10000 + 1000);

    await mailHelpers.sendForgotPassword(email, user.username, otp);
    const passwordToken = jwt.sign({ id: user._id, otp:otp }, process.env.FORGOT_PASSWORD_TOKEN, {
      expiresIn: process.env.PASSWORD_TOKEN_EXPIRED,
    });
    res.status(200).json({ passwordToken });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updatePassword = async (req,res)=>{
  try {
    const { newPassword, confirmPassword,OTP, passWordToken } = req.body;
    if (!newPassword || !confirmPassword || !OTP || !passWordToken) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }
    const response = await userService.updatePasswordService(newPassword,OTP,passWordToken);
    if (!response.success) {
      return res.status(400).json({ message: response.message });
    }
    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

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
    const user = await users.findById(req.user._id);
    
    
    res.status(200).json({
      id: user._id,
      email: user.email,
      username: user.username,
      role: user.role,
      avatar: user.avatar,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllUser = async (req, res) => {
  try {
    const { filter,search } = req.query;

    const response = await userService.getAllUserService(filter,search);

    if (!response.success) {
      return res.status(400).json({ message: response.message });
    }
    return res.status(200).json(response.Users);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.createTutorAccount = async (req, res) => {
  try {
    const { email, username, password, phoneNumber } = req.body;
    const image = req.file ? req.file.path : null;
    const respone = await userService.createTutorAccountService(
      email,
      username,
      password,
      phoneNumber,
      image
    );
    if (!respone.success) {
      {
        res.status(400).json({ message: respone.message });
      }
    }
    res.status(200).json(respone);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.activeOrDeactiveUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { status } = req.body;
    const response = await userService.activeOrDeactiveUserService(
      userId,
      status
    );
    if (!response.success) {
      return res.status(400).json({ message: response.message });
    }
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const response = await userService.getUserByIdService(userId);
    if (!response.success) {
      return res.status(400).json({ message: response.message });
    }
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      email,
      username,
      phoneNumber,
      oldPassword,
      newPassword,
      confirmNewPassword,
    } = req.body;


    const avatar = req.file?.path;

    if (!userId) {
      return res.status(400).json("User not found");
    }
    let response;
    if (!oldPassword || !newPassword || !confirmNewPassword) {
      response = await userService.updateUserService(
        userId,
        email,
        username,
        phoneNumber,
        avatar
      );
    } else {
      if (newPassword !== confirmNewPassword) {
        return res.status(400).json("Password is not match");
      }
      response = await userService.updateUserService(
        userId,
        email,
        username,
        phoneNumber,
        avatar,
        oldPassword,
        newPassword
      );
    }
    if (!response.success) {
      return res.status(400).json("Update failed");
    }
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json("Internal Server");
  }
};

exports.getAllStudentByTutor = async (req,res)=>{
  try { 
    const tutorId = req.user._id;
    if (!tutorId) {
      return res.status(400).json({message:"User not found"});
    }
    const response = await userService.getAllStudentByTutorService(tutorId);
    if (!response.success) {
      return res.status(400).json({message:response.message});
    }
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({message:"Internal Server",error});
  }
}

exports.getAllTutorByStudent = async (req,res)=>{
  try {
    const studentId = req.user._id;
    if (!studentId) {
      return res.status(400).json({message:"User not found"});
    }
    const response = await userService.getAllTutorByStudentService(studentId);
    if (!response.success) {
      return res.status(400).json({message:response.message});
    }
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({message:"Internal Server",error});
  }
}