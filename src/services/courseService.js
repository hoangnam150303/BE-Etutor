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
    return {success: true};
  } catch (error) {
    throw new Error(error.message);
  }
};

// update course
exports.updateCourseService = async (id,name, description, tutors, image) => {
  try {
    const course = await Course.findByIdAndUpdate(id,{
      name,
      description,
      tutors,
      image});
      console.log(course)
    if (!course) {
      throw new Error("Course not found");
    }
    return {success: true};
  } catch (error) {}
}

exports.deleteCourseService = async (id) => {
  try {
    const course = await Course.findByIdAndDelete(id);
    if (!course) {
      throw new Error("Course not found");
    }
    return {success: true};
  } catch (error) {}
};

exports.getDetailCourseService = async (id) => {
    try{
        const course = await Course.findById(id);
        if(!course){
            throw new Error("Course not found");
        }
        return course;
    }catch(error){}
};

exports.getAllCourseService = async () => {
    try{
        const courses = await Course.find();
        return courses;
    }catch(error){}
};

