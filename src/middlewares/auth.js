const jwt = require("jsonwebtoken");
const User = require("../models/users");

// Check role, only admin can use function belong in admin
exports.isAdmin = async (req, res, next) => {
  try {
    const token = req.headers.token?.split(" ")[1]; // Trích xuất token từ headers
    if (!token) {
      return res.status(401).json({
        message: "Token not provided",
        status: "ERROR",
      });
    }

    const decode = jwt.verify(token, process.env.ACCESS_TOKEN); // Giải mã token


    req.user = await User.findById({_id: decode.id, role:"Admin"}); // Tìm user dựa trên decode từ token
    if (!req.user) {
      return res.status(404).json({
        message: "User not found",
        status: "ERROR",
      });
    }

    next(); // Nếu hợp lệ, chuyển tiếp sang middleware tiếp theo
  } catch (error) {
    res.status(500).json({
      message: error.message,
      status: "ERROR",
    });
  }
};

// Check role, only shop, seller can use function belong in shop
exports.isTutor = async (req, res, next) => {
  try {
    const token = req.headers.token?.split(" ")[1]; // Trích xuất token từ headers
    if (!token) {
      return res.status(401).json({
        message: "Token not provided",
        status: "ERROR",
      });
    }
    
    const decode = jwt.verify(token, process.env.ACCESS_TOKEN); // Giải mã token
    req.user = await User.findOne({_id:decode.id, role:"Tutor"}); // Tìm user dựa trên decode từ token
    if (!req.user) {
      return res.status(404).json({
        message: "Shop not found",
        status: "ERROR",
      });
    }
    next(); // Nếu hợp lệ, chuyển tiếp sang middleware tiếp theo
  } catch (error) {
    res.status(500).json({
      message: error.message,
      status: "ERROR",
    });
  }
};


// Compare when users use website without login, they can see homepage but can not use any function in website
exports.isAuth = async (req, res, next) => {
    try {
      const token = req.headers.token.split(" ")[1];
      if (!token) {
        return res.status(401).json({
          message: "Login first",
          status: "ERROR",
        });
      }
      const decode = jwt.verify(token, process.env.ACCESS_TOKEN);
      req.user = await User.findById(decode.id);
      if (!req.user) {
        return res.status(404).json({
          message: "Login first",
          status: "ERROR",
        });
      }
      next();
    } catch (error) {}
};



