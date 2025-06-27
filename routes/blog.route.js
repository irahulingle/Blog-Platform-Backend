import express from "express";
import { isAuthenticated } from "../middleware/isAuthenticated.js";
import { singleUpload } from "../middleware/multer.js";
import {
  createBlog,
  deleteBlog,
  dislikeBlog,
  getAllBlogs,
  getMyTotalBlogLikes,
  getOwnBlogs,
  getPublishedBlog,
  likeBlog,
  togglePublishBlog,
  updateBlog,
} from "../controllers/blog.controller.js";

const router = express.Router();

// Public
router.get("/get-all-blogs", getAllBlogs);
router.get("/get-published-blogs", getPublishedBlog);

// Protected
router.get("/get-own-blogs", isAuthenticated, getOwnBlogs);
router.get("/my-blogs/likes", isAuthenticated, getMyTotalBlogLikes);
router.post("/", isAuthenticated, createBlog);
router.put("/edit/:blogId", isAuthenticated, singleUpload, updateBlog);
router.delete("/delete/:blogId", isAuthenticated, deleteBlog);

router.get("/action/:blogId/like", isAuthenticated, likeBlog);
router.get("/action/:blogId/dislike", isAuthenticated, dislikeBlog);
router.patch("/action/:blogId/publish", isAuthenticated, togglePublishBlog);

export default router;