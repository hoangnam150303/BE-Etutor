const Class = require("../models/class");
const randomCode = require("../helpers/GCodeHelpers");
exports.createClassService = async (studentId) => {
  try {
    const validClass = await Class.findOne({
      studentId: studentId,
      isFinish: false,
    });
    if (validClass) {
      throw new Error("Class already exists");
    }
    const randomName = "Etutor " + randomCode.generateRandomCode(5);
    await Class.create({ studentId: studentId, name: randomName });
    return { success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

exports.acceptClassService = async (classId, tutorId) => {
  try {
    const validClass = await Class.findById(classId);
    if (!validClass) {
      throw new Error("Class not found");
    }
    await Class.updateOne({
      _id: classId,
      tutorId: tutorId,
      isStart: true,
    });
    return { success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
};
