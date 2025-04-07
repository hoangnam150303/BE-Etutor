const express = require("express");
const blogRoute = express.Router();
const auth = require("../middlewares/auth");
const blogController = require("../controllers/blogController");
const upload = require("../utils/multer");
blogRoute.post("/createBlog", upload.fields([
    { name: "image" }, 
    { name: "file" }
]), 
auth.isAuth, blogController.createBlog);
blogRoute.put("/updateBlog/:id", upload.fields([
    { name: "image" }, 
    { name: "file" }
]),auth.isAuth, blogController.updateBlog);
blogRoute.get("/getBlogById/:id",auth.isAuth,blogController.getBlogById);
blogRoute.get("/getAllBlog",blogController.getAllBlog);
blogRoute.get("/getBlogByUser",auth.isAuth,blogController.getBlogWithUserId);
blogRoute.put("/activeOrDeactive/:id", auth.isAuth, blogController.activeOrDeactiveBlog)
blogRoute.put("/likeBlog/:id", auth.isAuth, blogController.likeBlog);
module.exports = blogRoute;
