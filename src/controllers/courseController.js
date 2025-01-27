const courseService = require("../services/courseService");

exports.createCourse = async (req, res) => {
  try {
    const { name, description, tutors, image } = req.body;
    if (!name || !description || !tutors || !image) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const respone = await courseService.createCourseService(
      name,
      description,
      tutors,
      image
    );
    if (!respone.success) {
      return res.status(400).json({ message: respone.message });
    }
    return res.status(200).json("Course created successfully");
  } catch (error) {}
};

exports.updateCourse = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, description, tutors, image } = req.body;
    const respone = await courseService.updateCourseService(
      id,
      name,
      description,
      tutors,
      image
    );
    if (!respone.success) {
      return res.status(400).json({ message: respone.message });
    }
    return res.status(200).json("Course updated successfully");
  } catch (error) {}
};

exports.deleteCourse = async (req, res) => {
  try {
    const id = req.params.id;
    const respone = await courseService.deleteCourseService(id);
    if (!respone.success) {
      return res.status(400).json({ message: respone.message });
    }
    return res.status(200).json("Course deleted successfully");
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getDetailCourse = async (req, res) => {
  try {
    const id = req.params.id;
    const course = await courseService.getDetailCourseService(id);
    return res.status(200).json(course);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getAllCourse = async (req, res) => {
  try {
    const courses = await courseService.getAllCourseService();
    return res.status(200).json(courses);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
