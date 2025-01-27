const classService = require("../services/classService");

// method post, this function is create new class, the student id will take from req.user._id, this id is from access_token in headers
exports.createClass = async (req, res) => {
  try {
    const studentId = req.user._id;
    if (!studentId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const response = await classService.createClassService(studentId);
    if (!response.success) {
      return res.status(400).json({ message: response.message });
    }
    return res.status(200).json("Class created successfully");
  } catch (error) {}
};

// method put, when staff accept class and arrange student and tutor to class
exports.acceptClass = async (req, res) => {
  try {
    const { classId, tutorId } = req.body;
    if (!classId || !tutorId) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const response = await classService.acceptClassService(classId, tutorId);
    if (!response.success) {
      return res.status(400).json({ message: response.message });
    }
    return res.status(200).json("Class accepted successfully");
  } catch (error) {}
};

exports.finishClass = async (req, res) => {};
