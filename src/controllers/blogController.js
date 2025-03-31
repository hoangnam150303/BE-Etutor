const blogService = require("../services/blogService");
exports.createBlog = async (req, res) => {
    try {
        const { title, content, courseName, className } = req.body;
        const userId = req.user._id;
        const image = req.files?.image?.map((file) => file.path).join(", ");
        const file = req.files?.file?.map((file) => file.path).join(", ");
        const response = await blogService.createBlogService(title, content, image, file, courseName, className, userId);
        if (!response.success) {
            return res.status(400).json({ message: response.message });
        }
        return res.status(200).json("Blog created successfully");
    } catch (error) {
        
        return res.status(500).json({ message: error.message });
    }
};
// update information blog
exports.updateBlog = async (req, res) => {
    try {
        const blogId = req.params.id;
        const { title, content, courseId, classId } = req.body;
        const image = req.files?.image?.map((file) => file.path).join(", ");
        const file = req.files?.file?.map((file) => file.path).join(", ");
      
        
        const response = await blogService.updateBlogService(blogId, title, content, image, file, courseId, classId);
        if (!response.success) {
            return res.status(400).json({ message: response.message });
        }
        return res.status(200).json("Blog updated successfully");
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

exports.activeOrDeactiveBlog = async (req, res) => {
    try {
        const id = req.params.id;
        const respone = await blogService.activeOrDeactiveBlogService(id);
        if (!respone.success) {
            return res.status(400).json({ message: respone.message });
        }
        return res.status(200).json("Success");
    } catch (error) {
        return res.status(500).json({ message: error.message });    
    }
};

exports.getAllBlog = async (req, res) => {
    try{
        const {filter,search} = req.query;

        
        const response = await blogService.getAllBlogService(filter,search);
   
        
        if(!response.success){
            return res.status(400).json({message: response.message});
        }
        return res.status(200).json(response);
    }catch(error){
        return res.status(500).json({message: error.message});
    }
};

exports.getBlogById = async (req, res) => {
    try {
        const blogId = req.params.id;
        if (!blogId) {
            return res.status(400).json({ message: "Id is require" });
        }
        const response = await blogService.getBlogByIdService(blogId);
        if (!response.success) {
            return res.status(400).json({ message: response.message });
        }
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

exports.getBlogWithUserId = async (req, res) => {
    try {
        const userId = req.user._id;
        const { filter, search } = req.query;
        
        if (!userId) {
            return res.status(400).json({ message: "Id is require" });
        }
        const response = await blogService.getBlogWithUserIdService(userId,filter, search );
        if (!response.success) {
            return res.status(400).json({ message: response.message });
        }
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

exports.likeBlog = async (req, res) => {
    try {
        const blogId = req.params.id;
        const userId = req.user._id;
        const response = await blogService.likeBlogService(blogId, userId);
        if (!response.success) {
            return res.status(400).json({ message: response.message });
        }
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
