const users = require("../models/users");
const Class = require("../models/class");
const Course = require("../models/courses");
const Blog = require("../models/blogs");
exports.createBlogService = async (title, content, image,file,courseId,classId, userId) => {
    try {
        const userValid = await users.findById(userId);
        if (!userValid) {
            throw new Error("User not found");
        }
        const validClass = await Class.findById(classId);
        if (!validClass) {
            throw new Error("Class not found");
        }
        const validCourse = await Course.findById(courseId);
        if (!validCourse) {
            throw new Error("Course not found");
        }
        const blog = await Blog.create({ title, content, image, author: userId, courseId: courseId, classId: classId, file });
        if (!blog) {
            throw new Error("Blog not created");
        }
        return { success: true};
    } catch (error) {
        throw new Error(error.message);
    }
};

exports.updateBlogService = async (blogId, title, content, image, file, courseId, classId) => {
    try {
        const validBlog = await Blog.findById(blogId);
        if (!validBlog) {
            throw new Error("Blog not found");
        }

        // Tạo đối tượng dữ liệu update với các trường bắt buộc
        const updateData = {
            title,
            content,
            courseId,
            classId,
        };

        // Chỉ cập nhật image nếu có thay đổi (ví dụ: image không rỗng)
        if (image && image.length > 0) {
            updateData.image = image; // Giả sử image là mảng chứa đường dẫn ảnh
        }

        // Chỉ cập nhật file nếu có thay đổi
        if (file && file.length > 0) {
            updateData.file = file; // Giả sử file là mảng chứa đường dẫn file
        }

        await Blog.findByIdAndUpdate(blogId, updateData, { new: true });
        return { success: true };
    } catch (error) {
        console.error(error);
        throw error;
    }
};

exports.activeOrDeactiveBlogService = async (blogId) => {
    try {
        const blog = await Blog.findById(blogId);
        if (!blog) {
            return { success: false, message: "Blog not found" };
        }
        blog.isActive = !blog.isActive;
        await blog.save();
        return { success: true, message: "Blog updated successfully" };
    } catch (error) {
        return { success: false, message: "Error updating blog" };
    }
};

exports.getAllBlogService = async (filter,search) => {
    try {
        let filterOptions = {};
        switch (filter) {
            case "popular":
                filterOptions = { like: -1 }; // Sắp xếp theo like giảm dần
                break;
            default:
                filterOptions = { createdAt: -1 }; // Sắp xếp theo thời gian tạo mới nhất
                break;
        }
        
        const blogs = await Blog.find({ ...(search && { title: { $regex: search, $options: "i" } }) })
        .populate("author", "username")
        .populate("courseId", "name")
        .populate("classId", "name")
        .sort({ createdAt: -1 },filterOptions)
        
        .where("isActive")
        .equals(true);
        
        if (!blogs) {
            throw new Error("Blog not found");
        }
        return { success: true, blogs };
    }catch(error){
        console.log(error);
        
    }
}

exports.getBlogByIdService = async (blogId) => {
    try {
        const blog = await Blog.findById(blogId)
        .populate("author", "username")
        .populate("courseId", "name")
        .populate("classId", "name");
       
        
        if (!blog) {
            throw new Error("Blog not found");
        }
        return { success: true, blog };
    }catch(error){
        console.log(error);
    }
}

exports.getBlogWithUserIdService = async (userId,filter,search) => {
    try {
        let filterOptions = {};
        switch (filter) {
            case "popular":
                filterOptions = { like: -1 }; // Sắp xếp theo like giảm dần
                break;
            case "isDeleted":
                filterOptions = {isActive:false};
                break;
            case "active":
                filterOptions = {isActive:true};
                break;
            default:
                filterOptions = {}; // Sắp xếp theo thời gian tạo mới nhất
                break;
        }

       const blog = await Blog.find({ ...(search && { title: { $regex: search, $options: "i" } }) })
        .populate("author", "username")
        .populate("courseId", "name")
        .populate("classId", "name")
        .where("author")
        .equals(userId)
        .sort({ createdAt: -1 })
        .sort(filterOptions);
        if (!blog) {    
            throw new Error("Blog not found");
        }
        return { success: true, blog };
    } catch (error) {
        console.log(error);
        
    }
}

exports.likeBlogService = async (blogId, userId) => {
    try {
        const blog = await Blog.findById(blogId);
        const user = await users.findById(userId);
        if (!blog || !user) {
            throw new Error("Blog or user not found");
        }
        if(blog.userLikeId.includes(userId)){
            blog.userLikeId.pull(userId);
            blog.like -= 1;
            await blog.save();
            return { success: true, message: "Blog unliked successfully" };
        }else{
            blog.userLikeId.push(userId);
            blog.like += 1;
            await blog.save();
            return { success: true, message: "Blog liked successfully" };
        }
    } catch (error) {
        console.log(error);
        
    }
}