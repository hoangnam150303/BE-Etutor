const classService = require("../services/classService");

// method post, this function is create new class, the student id will take from req.user._id, this id is from access_token in headers
exports.createClass = async (req, res) => {
  try {
    const studentId = req.user._id;
    const courseId = req.params.courseId;
    if (!studentId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const response = await classService.createClassService(studentId, courseId);
    if (!response.success) {
      return res.status(400).json({ message: response.message });
    }
    return res.status(200).json("Class created successfully");
  } catch (error) {}
};

// method put, when staff accept class and arrange student and tutor to class
exports.acceptClass = async (req, res) => {
  try {
    const { classId, tutorId } = req.params;

    if (!classId || !tutorId) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const response = await classService.acceptClassService(classId, tutorId);
    if (!response.success) {
      return res.status(400).json({ message: response.message });
    }
    return res.status(200).json("Class accepted successfully");
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// update information class
exports.updateClass = async (req, res) => {
  try {
    const classId = req.params.id;
    const tutorId = req.body.tutor;

    const response = await classService.updateClassService(classId, tutorId);

    if (!response.success) {
      return res.status(400).json({ message: response.message });
    }
    return res.status(200).json("Class updated successfully");
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// tutors will do this function, they have to finish class
exports.finishClass = async (req, res) => {
  try {
    const classId = req.params.id;
    const response = await classService.finishClassService(classId);
    if (!response.success) {
      return res.status(400).json({ message: response.message });
    }
    return res.status(200).json("Class finished successfully");
  } catch (error) {}
};

// upload document or video record class
exports.uploadFile = async (req, res) => {
  try {
    const classId = req.params.classId;
    const { session } = req.body;
    const senderId = req.user._id;
    const video = req.files?.video?.map((file) => file.path).join(", ");
    const document = req.files?.pdf?.map((file) => file.path).join(", ");
    const response = await classService.uploadFileService(
      session,
      classId,
      video,
      document,
      senderId
    );
    if (!response.success) {
      return res.status(400).json({ message: response.message });
    }
    return res.status(200).json("File uploaded successfully");
  } catch (error) {}
};

exports.getAllClass = async (req, res) => {
  try {
    const { filter, search } = req.query;
    const response = await classService.getAllClassService(filter, search);
    if (!response.success) {
      return res.status(400).json({ message: response.message });
    }
    return res.status(200).json(response.classValid);
  } catch (error) {}
};

exports.getClassById = async (req, res) => {
  try {
    const classId = req.params.id;
    if (!classId) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const response = await classService.getClassByIdService(classId);
    if (!response.success) {
      return res.status(400).json({ message: response.message });
    }
    return res.status(200).json(response);
  } catch (error) {}
};

exports.getAllClassByTutor = async (req, res) => {
  try {
    const tutorId = req.user._id;
    const response = await classService.getAllClassByTutorService(tutorId);
    if (!response.success) {
      return res.status(400).json({ message: response.message });
    }
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
