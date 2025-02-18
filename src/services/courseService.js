const users = require("../models/users");
const Course = require("../models/courses");

// create course
exports.createCourseService = async (name, description, tutors, image) => {
  try {
    const course = await Course.findOne({ name });

    if (course) {
      throw new Error("Course already exists");
    }

    await Course.create({
      name,
      description,
      tutors,
      image,
    });
    return { success: true };
  } catch (error) {
    throw new Error(error.message);
  }
};

// update course
exports.updateCourseService = async (id, name, description, tutors, image) => {
  try {
    let tutorsId = [];
    if (typeof tutors[0] === "string") {
      let user = await users.findOne({ username: tutors[0] });
      if (user) {
        for (let i = 0; i < tutors.length; i++) {
          user = await users.findOne({ username: tutors[i] });
          tutorsId.push(user._id);
        }
      } else {
        for (let i = 0; i < tutors.length; i++) {
          tutorsId.push(tutors[i]);
        }
      }
    }
    const course = await Course.findByIdAndUpdate(id, {
      name,
      description,
      tutors: tutorsId,
      ...(image && { image }),
    });
    if (!course) {
      throw new Error("Course not found");
    }
    return { success: true };
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.activeOrDeactiveCourseService = async (id) => {
  try {
    const course = await Course.findById(id);
    course.isDeleted = !course.isDeleted;
    await course.save();
    if (!course) {
      throw new Error("Course not found");
    }
    return { success: true };
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.getDetailCourseService = async (id) => {
  try {
    const course = await Course.findById(id).populate("tutors", "username");
    
    if (!course) {
      throw new Error("Course not found");
    }
    return course;
  } catch (error) {
    console.log(error);
    
  }
};

exports.getAllCourseService = async (filter, search) => {
  try {
    let filterOptions = {};
    switch (filter) {
      case "isDeleted":
        filterOptions = { isDeleted: true };
        break;
      case "isActive":
        filterOptions = { isDeleted: false };
        break;
      case "favorite":
        filterOptions = { classes: -1 };
        break;
      default:
        filterOptions = {};
    }

    // Lấy danh sách khóa học theo filter
    const courses = await Course.find({
      ...filterOptions,
      ...(search && { name: { $regex: search, $options: "i" } }),
    }).sort({ createdAt: -1 });

    // Lặp qua từng khóa học để lấy danh sách tutors tương ứng
    const coursesWithTutors = await Promise.all(
      courses.map(async (course) => {
        let tutors = [];

        if (Array.isArray(course.tutors) && course.tutors.length > 0) {
          const validTutors = await users
            .find({ _id: { $in: course.tutors }, role: "Tutor" })
            .select("username"); // Chỉ lấy username

          tutors = validTutors.map((tutor) => tutor.username);
        }

        return {
          ...course.toObject(),
          tutors,
        };
      })
    );

    return { success: true, courses: coursesWithTutors };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Internal Server Error" };
  }
};
