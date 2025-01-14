const jwt = require("jsonwebtoken");

// Tạo token chứa ID
exports.generateApproveToken = (id) => {
    const secretKey = process.env.SECRET_KEY ; // Mã bí mật JWT
    const token = jwt.sign({ id }, secretKey, { expiresIn: "1h" }); // Token hết hạn sau 1 giờ
    return token;
};
