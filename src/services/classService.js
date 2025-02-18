const Class = require("../models/class");
const users = require("../models/users");
const randomCode = require("../helpers/GCodeHelpers");
const Course = require("../models/courses");
const mailHelpers = require("../helpers/mailHelpers");
// create class service
exports.createClassService = async (studentId, courseId) => {
  try {
    const validClass = await Class.findOne({
      studentId: studentId,
      isFinish: false,
      courseId: courseId,
    });
    if (validClass) {
      // find class by student id and isFinish is false, courseId, if class is exist return and dont create new class.
      // That class have to finish so student can register another class with the same course.
      throw new Error("Class already exists");
    }
    const course = await Course.findById(courseId); // if valid class is not exist, find course by course id
    if (!course) {
      throw new Error("Course not found");
    }

    const randomName = "Etutor " + randomCode.generateRandomCode(5); // create random name for class
    await Class.create({
      // create class
      studentId: studentId,
      name: randomName,
      courseId: courseId,
    });
    return { success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// accept class service
exports.acceptClassService = async (classId, tutorId) => {
  try {
    const validClass = await Class.findById(classId); // find class by class id and if not exist return error

    if (!validClass) {
      throw new Error("Class not found");
    }
    await Class.findByIdAndUpdate(
      { _id: classId },
      {
        isAccepted: true,
        tutorId: tutorId,
        isStart: true,
        isFinish: false,
        startDate: Date.now(),
      }
    );
    const course = await Course.findById(validClass.courseId);
    course.classes = course.classes + 1 || 1;
    const student = await users.findById(validClass.studentId); // find student by student id and tutor by tutor id
    const tutor = await users.findById(tutorId);
    await mailHelpers.sendAcceptClass(
      // send mail to student and tutor to notificate that class has been accepted
      student.email,
      tutor.email,
      validClass.name
    );
    return { success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// update class service
exports.updateClassService = async (classId, tutorId) => {
  try {
    const validClass = await Class.findById(classId)
      .populate("tutorId", "email")
      .populate("studentId", "email"); // find class by class id and populate tutor id

    if (!validClass) {
      throw new Error("Class not found");
    }
    let messages = []; // create array messages if it has many messages.
    if (validClass.tutorId !== tutorId) {
      messages.push(" Change tutor in this Class");
    }
    await Class.findByIdAndUpdate(
      { _id: classId },
      {
        tutorId: tutorId,
      }
    );
    for (const message of messages) {
      await mailHelpers.sendUpdateClass(
        validClass.studentId.email,
        validClass.tutorId.email,
        validClass.name,
        message
      );
    }
    console.log(1111);

    return { success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// finish class service
exports.finishClassService = async (classId) => {
  try {
    const validClass = await Class.findById(classId)
      .populate("studentId", "email")
      .populate("tutorId", "email"); // find class by class id
    if (!validClass) {
      throw new Error("Class not found");
    }
    await Class.updateOne(
      { _id: classId },
      { $set: { isFinish: true, finishdate: Date.now() } }
    ); // update class and change isFinish to true
    await mailHelpers.sendFinishClass(
      validClass.studentId.email,
      validClass.tutorId.email,
      validClass.name
    ); // send mail to student to notificate that class has been finished
    return { success: true };
  } catch (error) {
    console.log(error);
  }
};

// upload file service
exports.uploadFileService = async (
  session,
  classId,
  video,
  document,
  senderId
) => {
  try {
    const validClass = await Class.findById(classId);
    if (!validClass) {
      throw new Error("Class not found");
    }

    let videoUrls;
    let documentUrls;
    let videos = [];
    let videoArr = [];
    let documents = [];
    let documentArr = [];

    if (video !== undefined) {
      videoUrls = video.split(",").map((v) => v.trim());

      videoUrls.forEach((v) => {
        videoArr.push(v);
      });
      for (let i = 0; i < videoArr.length; i++) {
        videos.push({
          name: session,
          url: videoArr[i],
          senderId: senderId,
          createDate: Date.now(),
        });
      }
    }

    if (document !== undefined) {
      documentUrls = document.split(",").map((d) => d.trim());
      documentUrls.forEach((v) => {
        documentArr.push(v);
      });
      for (let i = 0; i < documentArr.length; i++) {
        documents.push({
          name: session,
          url: documentArr[i],
          senderId: senderId,
          createDate: Date.now(),
        });
      }
    }

    if (documents.length > 0 && videos.length > 0) {
      validClass.documents.push(...documents);
      validClass.videos.push(...videos);
      validClass.save();
    } else if (type === "video") {
      validClass.videos.push(...videos);
      validClass.save();
    } else {
      validClass.documents.push(...documents);
      validClass.save();
    }

    return { success: true };
  } catch (error) {}
};

exports.getAllClassService = async (filter, search) => {
  try {
    let filterOptions = {};
    switch (filter) {
      case "isStart":
        filterOptions = { isStart: true };
        break;
      case "isFinish":
        filterOptions = { isFinish: true };
        break;
      case "regist":
        filterOptions = { isAccepted: false };
        break;
      default:
        filterOptions = {};
        break;
    }

    const classValid = await Class.find({
      ...filterOptions,
      ...(search && { name: { $regex: search, $options: "i" } }),
    })
      .sort({ createdAt: -1 })
      .populate("studentId", "username")
      .populate("tutorId", "username")
      .populate("courseId", "name");
    if (!classValid) {
      throw new Error("Class not found");
    }
    return { success: true, classValid };
  } catch (error) {
    console.log(error);
  }
};

exports.getClassByIdService = async (classId) => {
  try {
    const validClass = await Class.findById(classId)
      .populate("studentId", "username")
      .populate("tutorId", "username")
      .populate("courseId", "name");
    if (!validClass) {
      throw new Error("Class not found");
    }
    return {
      success: true,
      classValid: validClass,
    };
  } catch (error) {
    console.log(error);
  }
};

exports.getAllClassByTutorService = async (tutorId) => {
  try {
    const validClass = await Class.find({ tutorId: tutorId })
      .populate("studentId", "username")
      .populate("tutorId", "username")
      .populate("courseId", "name");
    if (!validClass) {
      throw new Error("Class not found");
    } else {
      return { success: true, classValid: validClass };
    }
  } catch (error) {
    throw new Error(error.message);
  }
};
