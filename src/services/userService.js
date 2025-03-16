const passWordHelpers = require("../helpers/passWordHelpers");
const mailHelpers = require("../helpers/mailHelpers");
const jwt = require("jsonwebtoken");
const users = require("../models/users");
const Class = require("../models/class");
exports.loginLocalService = async (email, password) => {
  try {
    if (!email || !password) {
      throw new Error("All fields are required");
    }

    const user = await users.findOne({ email, authProvider: "local" });

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
    const user = await users.findOne({ email, authProvider: "local" });
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
    await users.create({
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
    const user = await users.findOne({ email, authProvider: "local" });
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
    const user = await users.findOne({ email, authProvider: "local" });
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

exports.getAllUserService = async (filter,search) => {
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
      .find({username: { $regex: search, $options: "i" },...filterOptions })
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

exports.activeOrDeactiveUserService = async (userId, status) => {
  try {
    const validUser = await users.findById(userId);
    if (!validUser) {
      throw new Error("User not found");
    }
    validUser.status = status;
    await validUser.save();
    await mailHelpers.sendStatusAccount(
      validUser.email,
      validUser.username,
      validUser.status
    );
    return { success: true };
  } catch (error) {
    console.log(error);
  }
};

exports.getUserByIdService = async (userId) => {
  try {
    const validUser = await users.findById(userId);
    if (!validUser) {
      throw new Error("User not found");
    }
    return { success: true, user: validUser };
  } catch (error) {
    console.log(error);
  }
};

exports.updateUserService = async (
  userId,
  email,
  username,
  phoneNumber,
  avatar,
  oldPassword,
  newPassword
) => {
  try {
    const user = await users.findById({ _id: userId, authProvider: "local" });

    if (!user) {
      throw new Error("User not found");
    }
    if (avatar) {
      user.avatar = avatar;
    } else if (!oldPassword || !newPassword) {
      user.email = email;
      user.username = username;
      user.phoneNumber = phoneNumber;
    } else {
      const isMatch = await passWordHelpers.comparePassword(
        oldPassword,
        user.password
      );

      if (!isMatch) {
        throw new Error("Password not match");
      }
      const hashPassword = await passWordHelpers.hashPassword(newPassword, 10);
      user.email = email;
      user.username = username;
      user.phoneNumber = phoneNumber;
      user.password = hashPassword;
    }

    if (user) {
      user.save();
      return { success: true };
    }
    return { success: false };
  } catch (error) {
    console.log(error);
  }
};

exports.updatePasswordService = async (password, otp,passWordToken) => {
  try {
    const decode = jwt.verify(passWordToken, process.env.FORGOT_PASSWORD_TOKEN);
    if (!decode) {
      return {success: false};
    }
    if (decode.otp.toString() !== otp.toString()) {
      return {success: false, message: "OTP not match"};
    }
    const hashPassword = await passWordHelpers.hashPassword(password, 10);
    const user = await users.findById(decode.id);
    if (!user) {
      return {success: false, message: "User not found"};
    }
    user.password = hashPassword;
    await user.save();
    return {success: true};
  } catch (error) {
    return {success: false, message: error.message};
  }
}

exports.getAllStudentByTutorService = async (tutorId) => {
  try {
    const validTutor = await users.findById(tutorId).where("role").equals("Tutor");    
    if (!validTutor) {
      throw new Error("Tutor not found");
    }
    const validClasses = await Class.find({ tutorId: tutorId });
    if (!validClasses) {
      
      throw new Error("Class not found");
    }
    const studentIds =  validClasses.map((item) => item.studentId);
    const validStudents = await users.find({ _id: { $in: studentIds } });    
    if (!validStudents) {
      throw new Error("Student not found");
    }
    return { success: true, students: validStudents };
  } catch (error) {
    throw new Error(error.message);
  }
}

exports.getAllTutorByStudentService = async (studentId) => {
  try {
    const validStudent = await users.findById(studentId).where("role").equals("Student");    
    if (!validStudent) {
      throw new Error("Student not found");
    }
    const validClasses = await Class.find({ studentId: studentId });
    if (!validClasses) {
      
      throw new Error("Class not found");
    }
    const tutorIds =  validClasses.map((item) => item.tutorId);
    const validTutors = await users.find({ _id: { $in: tutorIds } });    
    if (!validTutors) {
      throw new Error("Tutor not found");
    }
    return { success: true, tutors: validTutors };
  } catch (error) {
    throw new Error(error.message);
  }
}