const express = require("express");
const blogRouter = express.Router();
// const userMiddleware = require("../middleware/userMiddleware");
const {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
} = require("../controllers/blogController");

// Create a new blog (public for now)
blogRouter.post("/",createBlog);


// Get all blogs (public)
blogRouter.get("/", getAllBlogs);

// Get a single blog by ID (public)
blogRouter.get("/:id", getBlogById);

// Update a blog (public for now)
blogRouter.put("/:id", updateBlog);

// Delete a blog (public for now)
blogRouter.delete("/:id", deleteBlog);

module.exports = blogRouter;
